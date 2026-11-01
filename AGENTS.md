<!-- bmad:context -->
<!-- Verified 2026-10-25 against af30651. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## Web File Commander

BMAD Level 4 homework project. React 19 + TypeScript + Vite, Vitest + jsdom + Testing Library, plain CSS, ESLint (typescript-eslint), no backend. The app is a read-only folder browser for Chrome/Edge (browser folder picker): Select Folder, File List with open-subfolder and Back, loading and access-denied messages. Folder Tree and Preview panels are empty placeholders. BMAD v6.12.4 is installed (`_bmad/`, skills in `.claude/skills/`); other docs live in `docs/`.

## Policy

- Plan and build new features through the BMAD planning and approval process; planning artifacts go in `_bmad-output/planning-artifacts`, implementation artifacts in `_bmad-output/implementation-artifacts`.
- Do not add unnecessary dependencies or features; keep diffs minimal.
- Never commit or push unless explicitly asked; never push to any remote.
- Never edit `_bmad/config.toml`, `_bmad/config.user.toml`, or `.claude/skills/*/customize.toml` — the installer overwrites them. Put overrides in `_bmad/custom/`.

## Where things are

- Entry: `src/main.tsx` mounts `App` into `#app`; layout in `src/App.tsx` and `src/App.css`.
- Only `src/access/` may touch the browser folder API (`FolderAccess` port; real and fake adapters). Folder state lives in `src/state/useFolderBrowser.ts`. Tests use `fakeFolderAccess`. A test enforces the boundary.
- Planning artifacts (brief, PRD, UX, architecture spine, `epics.md`) are under `_bmad-output/planning-artifacts/`; sprint status and the retrospective under `_bmad-output/implementation-artifacts/`.
- Read-only MCP server (stdio, registered in `.mcp.json`): `src/mcp/server.ts`, with listing logic in `src/mcp/projectFiles.ts`; how to verify it: `docs/exercise-12-mcp-server.md`. It runs with `node --experimental-strip-types`, so imports in `src/mcp/` need `.ts` extensions.
- Read-only review slash command `/project-check <file-path> <review-focus>`: `.claude/commands/project-check.md`; results and pending manual tests: `docs/level-5-exercise-4-project-check.md`.
- Requirements draft and exercise notes: `docs/` (`docs/requirements.md` is a draft).

## Running and verifying

Available commands (verified against `package.json`):

- `npm run dev` — start the Vite dev server (`vite`)
- `npm run build` — type-check and production build (`tsc && vite build`)
- `npm run lint` — ESLint (`eslint .`)
- `npm run test` — Vitest, single run (`vitest run`)
- `npm run check` — lint + test + build (CI-style validation)
- `npm run preview` — serve the production build (`vite preview`)

After changes run `npm run check` and fix failures.

- `tsc` runs only inside `npm run build` and only covers `src/`; there is no separate typecheck script.
- Vitest collects only `src/**/*.{test,spec}.*`; a test outside `src/` never runs.

## Conventions that differ from defaults

- `tsconfig.json` does not enable `strict`; it sets `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly`. Remove unused locals/params; use `import type` for type-only imports.
- Components export a default function component; plain CSS co-located (`src/App.css`).
- Tests sit next to the code as `*.test.tsx`.
- No comments in code unless explicitly requested.
- Read existing files to match conventions before changing them.

## Known pitfalls

- Write multi-line files with the file tools, not shell heredocs: in this Windows shell two heredoc writes failed and wrote nothing. Check `git status` after writing.
- A `cd` in one shell call carries into the next. Use absolute paths; a later command once ran from inside `.claude/skills/`.
- When you change code or config that `AGENTS.md` describes, update `AGENTS.md` in the same commit; `src/project-rules.test.ts` fails on missing npm scripts and files.

<!-- /bmad:context -->
