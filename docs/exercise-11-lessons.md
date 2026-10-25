# Exercise 11 — Lessons learned as rules

Three lessons from this project, each written as a rule. Rule 1 is enforced by a test, and Rule 2 by two guard tests. Rules 1 and 3 are also in `AGENTS.md`.

## Rule 1 — Instruction files must match the repo

**Where it came from:** In Exercise 4, `CLAUDE.md` said "TypeScript strict via tsconfig", but `tsconfig.json` has no `strict`. It also said "Do NOT install BMAD" after BMAD was installed, and it left out the `preview` script. At the end of the build, `AGENTS.md` still said the app was only a static layout.

**Rule:** Anything `AGENTS.md` names (npm scripts, files, compiler flags) must exist and be true. Change `AGENTS.md` in the same commit as the code or config it describes.

**Bad:**
```
`npm run typecheck` runs the type check.      (no such script)
TypeScript strict via tsconfig.               (strict is not set)
```

**Good:**
```
`npm run build` runs `tsc && vite build`.
`tsconfig.json` does not enable `strict`; it sets `noUnusedLocals`, ...
```

**Enforcement:** `src/project-rules.test.ts` fails if `AGENTS.md` mentions an `npm run` script missing from `package.json`, a `src/` or `docs/` file that does not exist, or a `strict` claim that disagrees with `tsconfig.json`. I checked that it fails: with a made-up script and file added to `AGENTS.md`, two of the three tests failed, and I reverted the change.

## Rule 2 — Browser file APIs live only behind the access port

**Where it came from:** Architecture decisions AD-2 and AD-8. The real folder picker cannot run in the test environment, so anything that calls it directly cannot be tested.

**Rule:** Only `src/access/` may reference `showDirectoryPicker` or the file handle types. UI and state code use the `FolderAccess` port, and tests use `fakeFolderAccess`. The port has no write operations.

**Bad:**
```ts
// src/App.tsx
const handle = await window.showDirectoryPicker();
```

**Good:**
```ts
// src/App.tsx
const chosen = await access.chooseFolder();
```

**Enforcement:** two guard tests in `src/App.test.tsx` ("keeps browser file APIs inside src/access/" and "exposes no write operations on the FolderAccess port").

## Rule 3 — Write files with the file tools, and check what was written

**Where it came from:** During the build in this Windows shell, two multi-line shell heredoc commands failed and wrote nothing. A `cd` into `.claude/skills/...` also carried into later commands, so they ran from the wrong folder.

**Rule:** Create or edit multi-line files with the file tools. Use absolute paths. After a write, check `git status` or the file list before moving on.

**Bad:**
```
cd .claude/skills/x && python - <<'EOF' ... EOF     # nothing written, no warning in the file list
npm run check                                          # runs from the wrong folder
```

**Good:**
```
Write tool with the absolute path to the file
git status --short                                     # confirm the file is there
```

**Enforcement:** none. This is a working habit, recorded in `AGENTS.md` under Known pitfalls.
