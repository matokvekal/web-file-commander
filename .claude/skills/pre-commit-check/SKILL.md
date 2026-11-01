---
name: pre-commit-check
description: Read-only check that the repo is ready for a commit (AGENTS.md rules, git status, `npm run check`), ending in a ready or not-ready verdict. Use when the user (1) asks "is this ready to commit?", (2) asks to "verify before commit" or run a "pre-commit check", or (3) asks whether lint, tests and build pass before committing. Not for code review, implementing or fixing changes, committing, or pushing; never stages, commits or pushes.
allowed-tools: Read, Grep, Bash, PowerShell
---

# Pre-commit check

Runs the verification procedure for this repo and reports whether it is ready for a commit. It never commits, pushes, stages or edits files.

## Files

- Script: [scripts/check.ps1](scripts/check.ps1) runs the deterministic checks.
- Checklist: [references/checklist.md](references/checklist.md) lists the judgment checks.

## Prerequisites

- Windows PowerShell 5.1 or PowerShell 7+ (`pwsh`).
- `git` and `node` with `npm` on `PATH`, and dependencies installed (`npm install`).
- Run inside the repository; the script finds the root itself.
- The script is read-only apart from the build output in the gitignored `dist/`.

## Steps

1. Read `AGENTS.md` and [references/checklist.md](references/checklist.md).
2. Run the script from the repository root:

   ```
   pwsh -NoProfile -File .claude/skills/pre-commit-check/scripts/check.ps1
   ```

   Use `powershell -NoProfile -ExecutionPolicy Bypass -File ...` if `pwsh` is not installed. Exit code 0 means all checks passed, 1 means a check failed, 2 means the script could not start.
3. Inspect the script output: the `rules-*` lines, the `git-status` line with the changed-path listing, and the `npm run check` output.
4. Review the changed files against the checklist, using `git diff` for the judgment items.
5. Verify before reporting success: confirm the output contains `RESULT: PASS` and the exit code was 0, and that lint, tests and build each ran cleanly. If any step failed or was cut off, report failure with the relevant output.
6. Report each check with its result, then a verdict: ready for a commit, not ready (with the reasons), or nothing to commit (clean tree).

## Rules

- Do not run `git commit`, `git add` or `git push`; do not modify files. Committing happens only when the user explicitly asks.
- Do not fix failures silently; report them, and fix only if the user asks.
- Report skipped steps as skipped.
