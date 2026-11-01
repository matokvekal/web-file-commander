# Level 5, Exercise 8: one clone, full setup

Goal: the Level 5 setup works for a teammate after a fresh clone.

## Configuration (committed, relative paths only)

- `.claude-plugin/marketplace.json` at the repository root defines the marketplace `local-marketplace` with two plugins: `project-tools` (`./local-marketplace/plugins/project-tools`) and `file-viewer` (`./mods/file-viewer`). The manifest moved from `local-marketplace/.claude-plugin/` because plugin sources must live inside the marketplace root and the validator rejects `..`.
- `.claude/settings.json` sets `extraKnownMarketplaces.local-marketplace` to the directory source `.` and `enabledPlugins` to `project-tools@local-marketplace` and `file-viewer@local-marketplace`.
- `.mcp.json` registers `project-files` with `node --experimental-strip-types --no-warnings src/mcp/server.ts` (relative path, no machine-specific values).

## Fresh clone

- Location: `E:\DEV2026\DDOS\homeWork-l2\fresh-clone-ex8` (outside the repository; `git clone --branch ex6-file-viewer` of the local repository, so its `origin` is the local folder, not a remote).
- No file in the clone was edited. Dependencies came from `npm ci`; `git status` in the clone stayed empty after every check.
- The clone is of commit `e527ede`. The README fix below was committed afterwards in the original repository only.

## Verified (2026-11-01)

| Check | Result |
| --- | --- |
| `npm ci` in the clone | succeeded (reports 10 moderate audit findings; not changed, no dependency changes made) |
| `npm run check` in the clone | passed: lint, 88 tests, build |
| `claude plugin validate` on the clone root (marketplace), `mods/file-viewer` and `local-marketplace/plugins/project-tools` | all passed |
| MCP server started from the clone (`node --experimental-strip-types src/mcp/server.ts`, stdio handshake) | initialize answered; `list_project_files` listed on `tools/list`; a call on `src` returned the folder entries; `path: ".."` returned "Path must not leave the project." |
| Skill script `pre-commit-check/scripts/check.ps1` run from the clone | `RESULT: PASS`, exit 0 |
| Absolute paths | none in committed config or docs; only intentional fixtures in `src/fileViewerMod.test.ts` and `src/mcp/projectFiles.test.ts`, and the author name `gilad` in manifests |
| Secrets | pattern scan found none; no `.env`, key or credential files tracked; `.claude/settings.local.json` is not tracked |
| Machine-specific dependencies | Node 22.6 or newer was undocumented (fixed in README); the skill script needs PowerShell (now in README) |

## Fixes in the original repository (separate commits)

1. `3d55f96`: add file-viewer to the marketplace, move the manifest to the repo root, enable both plugins in `.claude/settings.json`, add an author to the mod manifest.
2. README: state Node 22.6 or newer and the PowerShell need.

## PENDING MANUAL VERIFICATION

`claude plugin marketplace list` and `claude plugin list` run inside the clone do not show the project marketplace or plugins before the folder is trusted, and trusting is an interactive prompt that was not approved. Open an interactive session:

```
cd E:\DEV2026\DDOS\homeWork-l2\fresh-clone-ex8
claude
```

1. Accept the trust prompt (this is the step that is yours). Claude Code should offer `local-marketplace` without you typing an install path, and the two plugins should be enabled. Check with `/plugin`.
2. `/mcp`: `project-files` should be listed. Approve it when asked; it should connect with 1 tool and 1 prompt. Ask Claude to list `src` with the tool.
3. Skill: ask "is this ready to commit?" or run `/project-tools:pre-commit-check`. It should end with a verdict.
4. Command: `/project-tools:project-check src/main.tsx maintainability` should print a review; the unprefixed `/project-check` also works from `.claude/commands/`.
5. File-viewer pane: run `/file-viewer` (the enabled plugin registers it), expand folders, press a file and check the preview (full steps in `docs/level-5-exercise-6-file-viewer-mod.md` and `docs/level-5-exercise-7-file-preview.md`). The mod has never been loaded in a session.
6. If the marketplace is not offered, report the exact message; the likely cause is that a directory source of `.` is not honored in `extraKnownMarketplaces`, which cannot be told from the CLI without trusting the folder.
7. Do not edit files in the clone. If anything fails, tell me and I fix it in the original repository and make a new clone.
