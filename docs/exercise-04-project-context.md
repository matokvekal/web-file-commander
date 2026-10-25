# Exercise 4 — Project Context

Ran the `bmad-project-context` workflow (adopt intent) against the repository at `ea297af`. Only what exists was documented.

## What was inspected

`CLAUDE.md`, `package.json`, `README.md`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`, `src/`, `docs/`, `_bmad/config.toml`, and `git log`. There was no `AGENTS.md`. `npm run check` exits 0 at this commit.

## Findings

- `CLAUDE.md` said "TypeScript strict via tsconfig", but `tsconfig.json` has no `"strict"`. Only individual flags are set.
- `CLAUDE.md` said "Do NOT install BMAD", but BMAD v6.12.4 was installed in Exercise 3 (`ea297af`).
- `CLAUDE.md` said "File-manager features do not exist yet" but did not mention the layout in `src/App.tsx`.
- The homework restrictions (no PRD, architecture, epics, stories, EARS, or file-manager features) were setup-stage rules. They were removed by the user's decision, because they would conflict with later exercises. Policy now says to follow the BMAD planning and approval process.

## Where each CLAUDE.md instruction landed

| Original | Result |
| --- | --- |
| Project status, Tech stack | Rewritten into the Orientation paragraph |
| Constraint: no file-manager features | Removed (user decision); replaced by the BMAD planning/approval policy line |
| Constraints: no PRD/architecture/epics/stories, no EARS | Removed (user decision) |
| Constraint: no unnecessary dependencies, stay minimal | Kept in Policy |
| Constraint: no push to remote; workflow "never commit or push unless asked" | Merged into one Policy line |
| Constraint: do NOT install BMAD | Removed, because it was stale. Replaced by "never edit installer-managed files; use `_bmad/custom/`" |
| Code style: strict via tsconfig | Corrected to list the flags actually set |
| Code style: default component export, co-located CSS, `*.test.tsx`, no comments | Kept in Conventions |
| Available commands | Kept in full and re-verified against `package.json`. `preview` was added because it exists there |
| Workflow 1–3 | Kept (read first; `npm run check`; minimal diffs), plus the `tsc`/Vitest scope facts |

## How the instructions load in a fresh session

- Claude Code reads `CLAUDE.md` from the project root at session start. It does not read `AGENTS.md` by itself.
- `CLAUDE.md` now contains only `@AGENTS.md`, which imports the file. The rules live in one place, so there is no duplication.
- Tools that read `AGENTS.md` natively use it directly.
- The `<!-- bmad:context -->` markers delimit the managed block. Re-running `bmad-project-context` replaces text inside them, and anything outside the markers is preserved.

## Verification

A separate `claude -p` session was started in the repo with no tools allowed and asked, from loaded instructions only, about the commit/push policy, the protected `_bmad` files, whether `strict` is enabled, and the npm scripts. It answered all four correctly, quoting `AGENTS.md` content. This confirms that `CLAUDE.md` containing `@AGENTS.md` loads the block in a fresh session.

## Maintenance

Re-run `bmad-project-context` after significant change. Use its `record` intent when an agent gets something wrong. Commands are verified against `package.json` as of `ea297af`.
