# Level 5, Exercise 10: review-with-agent skill

`.claude/skills/review-with-agent/SKILL.md` is a project skill whose frontmatter sets `context: fork` and `agent: project-reviewer`. Invoking it runs the review in a forked context on the read-only reviewer from Exercise 9 (tools Read, Grep, Glob) and returns only a short verdict to the main session. The skill body is the review procedure and the answer format (under 120 words: `Verdict: PASS|FAIL`, then one line per violation).

Usage: `/review-with-agent <file-path> [more file paths]`.

## Test (2026-11-01, headless)

The same violation as Exercise 9 was planted: the comment `// TEMP-EX9: planted rule violation, to be removed` before `createRoot(...)` in `src/main.tsx` (rule: "No comments in code unless explicitly requested").

Command, from PowerShell in the worktree root: `claude -p "/review-with-agent src/main.tsx" --resume <session> --output-format json --allowedTools Agent`

Result returned to the main session:

```
Verdict: FAIL (1 violation)

...\src\main.tsx:6 [high] "No comments in code unless explicitly requested." - Delete the `// TEMP-EX9: planted rule violation, to be removed` comment line.
```

The violation was detected and the answer was a short verdict. The violation was then removed with a targeted edit; `git status` showed no change to `src/main.tsx` and no `TEMP-EX9` text remained.

## /context before and after

`claude -p "/context" --resume <session>` was run in the same session before and after the review. Totals include a fixed base of about 19.5k tokens (system prompt, tools, skills, memory files) that does not change.

| Invocation | Total before | Total after | Messages before | Messages after | Messages growth |
| --- | --- | --- | --- | --- | --- |
| `/review-with-agent src/main.tsx` | 19.5k | 22.4k | 10 | 3k | about 2.9k |
| Direct: "use the project-reviewer subagent to review src/main.tsx" | 19.5k | 36.5k | 10 | 17k | about 17k |

Caveats: one run each, headless and resumed, so it is not the interactive `/context` view. The direct run also includes the calling model's own turn and the Agent tool it needed, so the difference is larger than the review output alone. The direction (skill much smaller) is what the numbers support; the exact ratio is not established.

## Direct agent versus skill

| | Direct agent call | `review-with-agent` skill |
| --- | --- | --- |
| Started by | The main model (or you) decides to delegate and writes the prompt | You type `/review-with-agent <files>`; the skill text is the prompt |
| Procedure and output format | Whatever the caller writes each time | Fixed in the skill: same steps, same short verdict format |
| Context in the main session | The delegation prompt, the agent's full report and the main model's relay of it | The invocation and the short verdict |
| Repeatability | Varies with how it is asked | Stable; the format can be checked |
| Flexibility | Any task the agent can do | Review of named files only |
| Tools | Agent's own: Read, Grep, Glob | Same, because the skill runs on that agent |

## PENDING MANUAL VERIFICATION

Interactive checks were not run:

1. Run `/context`, then `/review-with-agent src/main.tsx` (with a comment added to that file), then `/context` again. Compare the Messages row; expect a small increase. Remove the comment yourself afterwards.
2. Confirm `/review-with-agent` appears in the slash command list with its argument hint.
3. Confirm the forked skill is reported as running on `project-reviewer` (for example in the transcript or `/agents`).
