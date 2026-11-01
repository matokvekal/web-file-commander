# Level 5, Exercise 4: `/project-check` slash command

Project command in `.claude/commands/project-check.md`. It reviews one project file for one focus. It is review only: it never edits, creates, deletes or stages anything.

Usage: `/project-check <file-path> <review-focus>`, for example `/project-check src/App.tsx accessibility`.

## How each requirement is met

| Requirement | Where |
| --- | --- |
| Exactly two arguments | `arguments: [file, focus]` in the frontmatter names them; the body stops with the usage line if either is empty or a third is given (`$ARGUMENTS`). |
| Both arguments used | `$file` in the heading, the git command, the path validation and the read step; `$focus` in the task sentence and the review step. |
| Live Git context | ``!`git log --oneline -n 5 -- "$file"` `` runs before the model sees the prompt. |
| Project rules | `@AGENTS.md` inlines the file. |
| Minimal pre-allow | `allowed-tools: Bash(git log --oneline -n 5 -- *)`. Nothing else is allowed. |
| Path inside the project | Git refuses a path outside the repository (the command stops before the model runs). The prompt then rejects absolute paths, `..`, `.git`, `node_modules`, `dist`, the BMAD config files, directories and missing files before it calls Read. |
| Review only | The prompt forbids edits and other commands, and the only pre-allowed tool is the one `git log`. Fixes are suggested as text. |

## Bugs found while testing

- `$1` and `$2` are zero-based, so `$1` was the focus. The first design (`$1`, `$2`) ran `git log` on the focus word and treated a valid call as having an empty second argument. Fixed by using the named arguments `$file` and `$focus`.
- In Git Bash, `claude -p "/project-check ..."` turns `/project-check` into `C:/Program Files/Git/project-check`, so the command is not expanded. Set `MSYS_NO_PATHCONV=1`, or run it from PowerShell or interactively.

## Test results

All runs were non-interactive (`claude -p "/project-check ..."` in the worktree, default permissions, `MSYS_NO_PATHCONV=1`) on 2026-11-01, after the fix above. `git status` after the runs showed no change except the new command and doc files.

| # | Input | Result |
| --- | --- | --- |
| 1 | `src/App.tsx accessibility` | Passed. Git context correct (`d3076a8` last). Findings on the broad `aria-live` region, the status bar not being a live region, and `tabIndex` on file names. |
| 2 | `src/mcp/projectFiles.ts security` | Passed. Git context correct (only `93515b8`). Low-severity findings on case-sensitive exclusions and the exclusion check running before `realpath`. |
| 3 | `src/state/useFolderBrowser.ts maintainability` | Passed. Git context correct (three story commits). Findings on duplicated stack state and denied handling. |
| 4 | `../outside.txt security` | Rejected before the model ran (0 turns): `git log` fails with "outside repository" and the command stops with empty output. |
| 5 | `src/nope.ts security` | Rejected by the prompt: file does not exist. |
| 6 | `src/App.tsx` (one argument) | Printed the usage line only. |

Run 1 of the very first attempt (before the `MSYS_NO_PATHCONV` fix) did not expand the command and is not counted.

## Pending: interactive tests

Not performed in the interactive UI, so still to do by hand:

1. Start Claude Code in the project folder, type `/project-check` and confirm it appears with the hint `<file-path> <review-focus>`.
2. Run `/project-check src/App.tsx accessibility` and confirm no permission prompt appears for the `git log` call.
3. Confirm that a `Bash` call other than that `git log` would still prompt.
