---
name: review-with-agent
description: Review one or more project files against AGENTS.md in an isolated read-only context and return a short verdict. Use when the user asks to "review with agent", wants a rules review of named files, or wants a review that does not fill the main conversation. Review only; it never edits.
argument-hint: <file-path> [more file paths]
context: fork
agent: project-reviewer
---

# Review with agent

Review these files: $ARGUMENTS

If no file path was given, reply only with the usage `/review-with-agent <file-path> [more file paths]` and stop.

## Procedure

1. Read `AGENTS.md` and keep its Policy, Conventions and Known pitfalls as the rules.
2. Read each named file. Do not review files that were not named.
3. Check each file against the rules and note every violation with its line number and the rule it breaks (quote the AGENTS.md wording).
4. Do not edit, create or delete anything. Give each fix as text only.

## Answer format

Keep the answer under 120 words:

- First line: `Verdict: PASS` or `Verdict: FAIL (<n> violations)`.
- One line per violation: `<file>:<line> [high|medium|low] <rule> - <fix>`.
- If it passes, one line listing the files read.
