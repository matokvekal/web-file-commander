# Pre-commit checklist

Judgment checks the script cannot do. Run the script first; this list covers the rest.

## Project rules (from AGENTS.md)

- [ ] No commit or push was made by this skill.
- [ ] No edits to `_bmad/config.toml`, `_bmad/config.user.toml` or `.claude/skills/*/customize.toml`.
- [ ] No unnecessary dependencies or features; the diff is minimal.
- [ ] No comments added to code unless requested.
- [ ] Unused locals and parameters removed; `import type` used for type-only imports.
- [ ] Imports in `src/mcp/` carry `.ts` extensions.
- [ ] Only `src/access/` touches the browser folder API.
- [ ] If code or config that `AGENTS.md` describes changed, `AGENTS.md` changed in the same commit.

## Git

- [ ] Every changed path in the script's status listing is expected.
- [ ] No stray files: build output, logs, secrets, scratch files.
- [ ] The branch is the intended one.
- [ ] The working tree matches what the user asked to commit (a clean tree means nothing to commit).

## Verification

- [ ] The script printed `RESULT: PASS` and exited 0.
- [ ] Lint, tests and build each passed in the `npm run check` output, not only the final exit code.
- [ ] Any failure is reported with its output, not summarized away.

## Ready for commit means

All items above hold and the working tree has changes to commit. Report each check and its result. Do not run `git commit`.
