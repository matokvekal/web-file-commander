# Level 5, Exercise 9: read-only project reviewer agent

`.claude/agents/project-reviewer.md` is a project subagent that reviews named files against `AGENTS.md` and reports violations. It cannot change anything.

## Definition

| Field | Value | Why |
| --- | --- | --- |
| `tools` | `Read, Grep, Glob` | Enough to read the rules and the files and look at neighbouring files. No Bash, Edit, Write, NotebookEdit, web or MCP tools, so it cannot modify files or run commands. |
| `model` | `sonnet` | The task is checking a file against a short written rule list; the strongest model is not needed and costs more. |
| `effort` | `medium` | Rule matching needs some care (quoting the rule, giving line numbers) but not deep reasoning. |

Behaviour is set in the agent's prompt: read `AGENTS.md` first, review only the files it is given (it cannot run git, so it cannot find changed files itself), report file, line, quoted rule, severity and a suggested fix as text, and refuse any request to edit.

## Test (2026-11-01, headless)

Both delegations used `claude -p "<prompt>" --allowedTools Agent` from PowerShell, so the calling session could only delegate and could not edit files itself.

| Step | Result |
| --- | --- |
| Plant a violation: the comment line `// TEMP-EX9: planted rule violation, to be removed` before `createRoot(...)` in `src/main.tsx` (rule: "No comments in code unless explicitly requested") | `git diff` showed exactly that one added line |
| Delegate a review of `src/main.tsx` to `project-reviewer` | Detected: reported line 6, quoted the "No comments in code unless explicitly requested" rule, suggested deleting the line, and listed the checks that passed. The subagent used only Read and Glob. |
| Ask the agent to fix it | Refused: "I did not edit `src/main.tsx`. This agent is read-only and has no edit tools." It gave the fix as text. The file's SHA-256 prefix was `ef91eb98...` before and after, and the violation line was still present. |
| Revert | Removed only the planted line with a targeted edit (no `git checkout`). `git diff` was empty afterwards and no `TEMP-EX9` text remained. |
| `npm run check` | passed: lint, 88 tests, build |

Observations, not defects:

- The reviewer rated the same violation high in the first run and low in the second, so severity labels vary between runs; detection and refusal were consistent in both.
- In the first run the subagent said it worked from the `AGENTS.md` text injected into its prompt (through `CLAUDE.md`) rather than reading the file; its prompt still tells it to read `AGENTS.md`.
- The test sessions also loaded the `file-viewer` mod, because `.claude/settings.json` now enables it (see `docs/level-5-exercise-8-fresh-clone.md`). Claude Code wrote `mods/file-viewer/tsconfig.json`, a generated stub, which is now in `.gitignore`. The generated `mods/file-viewer/.claude-plugin/types/` made `npm run lint` fail (51 errors in the engine's 15,000-line declaration files), so it is excluded in `eslint.config.js` (separate commit).

## PENDING MANUAL VERIFICATION

Only headless delegation was run. In an interactive session:

1. Run `/agents` and confirm `project-reviewer` is listed as a project agent with the tools Read, Grep and Glob.
2. Ask "use the project-reviewer agent to review src/main.tsx", with a comment added to that file, and confirm it reports the violation.
3. Ask it to fix the violation and confirm it refuses. Remove the comment yourself afterwards.
