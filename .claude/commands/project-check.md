---
description: Read-only review of one project file for one focus (accessibility, security, maintainability, ...)
arguments: [file, focus]
argument-hint: <file-path> <review-focus>
allowed-tools: Bash(git log --oneline -n 5 -- *)
---

# Project check

Review the file `$file` with the review focus `$focus`. Review only: do not edit, create, delete or stage anything, and do not run any command other than the one below.

## Arguments

- `$file` is the file path, relative to the project root.
- `$focus` is the review focus. It is one word or a quoted phrase.

If `$file` or `$focus` is empty, or a third argument was given (the full input was: `$ARGUMENTS`), stop and reply only with the usage: `/project-check <file-path> <review-focus>`.

## Live Git context for `$file`

Last five commits that touched the file (an empty result means the file is untracked or the path is not in this repository):

!`git log --oneline -n 5 -- "$file"`

## Project rules

@AGENTS.md

## Validate the path first

Before reading `$file`, stop with a one-line reason and no review if any of these is true:

- It is absolute, has a drive letter, starts with `~`, or contains `..` or a null byte.
- It points into `.git`, `node_modules`, `dist`, or `_bmad/config.toml`/`_bmad/config.user.toml`.
- It does not exist as a regular file inside the project root (use Glob to confirm; a directory is not accepted).

Only then read the file with Read.

## Review

Judge the file only through the lens of `$focus`, against the project rules above and the git history shown. Use Read and Grep for context (for example a test file next to it), nothing else.

Report:

1. **Scope**: file, focus, and the git context in one line.
2. **Findings**: each with `line`, severity (high, medium, low), the problem, and a suggested fix as text. If there are none, say so.
3. **Rule check**: any AGENTS.md convention the file breaks, or "none".
4. **Verdict**: one sentence.

Suggested fixes are text only. Never apply them.
