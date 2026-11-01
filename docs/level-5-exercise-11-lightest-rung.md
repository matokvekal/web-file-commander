# Level 5, Exercise 11: the lightest rung

Every extension should justify its complexity. The short version is in `CLAUDE.md`; this is the inventory and the reasoning.

## Inventory (branch `ex6-file-viewer`)

| Kind | Items | Mechanism | Why not something lighter |
| --- | --- | --- | --- |
| Rules | `CLAUDE.md` (imports `AGENTS.md`), `AGENTS.md` | Always-loaded memory files | They must apply to every task. The cost is paid every session, so they hold rules only; exercise notes are in `docs/`. |
| Command | `.claude/commands/project-check.md` | Slash command | One fixed prompt with two arguments and one live `git log` line. No script and no auto-triggering needed, so a skill would be heavier. |
| Skills (ours) | `pre-commit-check` | Skill with a script and a checklist file | A command cannot ship files beside the prompt or load only when relevant. |
| | `review-with-agent` | Skill with `context: fork` and `agent: project-reviewer` | A plain skill or direct delegation puts the review into the main context (Exercise 10: about 2.9k versus 17k tokens of messages). |
| Skills (not ours) | 29 `bmad-*` skills | Installed by BMAD | Must be preserved; not edited. |
| Agent | `.claude/agents/project-reviewer.md` | Subagent, tools Read, Grep, Glob | A tool restriction can be enforced on an agent, not on a prompt or a command. |
| MCP servers | `project-files` (1) | stdio server in `.mcp.json` | See below. |
| Plugins | `project-tools`, `file-viewer` | Entries in the marketplace `.claude-plugin/marketplace.json`, offered by `.claude/settings.json` | Packaging so a teammate installs them from a fresh clone without a path. |
| Hook | `SessionStart` echo in `project-tools` | Plugin hook | The smallest safe hook that proves the mechanism; it runs `echo` and nothing else. |
| Mod | `mods/file-viewer` | Claude Code mod, `$.fs` only | A pane beside the chat cannot be built with a skill, command, agent, hook or MCP server. |

Outside the repository, the user's own plugins and claude.ai connectors also load into sessions (for example the Claude Docs MCP tools in the measurements). They are not part of the repository and were not touched.

## Number of MCP servers

The repository configures one: `project-files`. Its single tool definition costs 222 tokens in `/context`'s MCP tools table. Each further server would add its own tool definitions to every session, so a second server is justified only by a capability the first cannot give. The package.json resource and the explain prompt live in the same server for that reason. Honest note: inside Claude Code, the built-in Read and Glob can already list files, so the server exists for the Exercise 1 requirement and for MCP clients other than Claude Code; it is kept small, read-only and capped at 200 entries by default.

## What was simplified

`AGENTS.md` is loaded in every session, and Exercises 4 to 10 had each added a long pointer bullet to it (five bullets, about 400 tokens). They were collapsed into one line that points to `docs/level-5-exercise-*.md` and `CLAUDE.md`. The MCP bullet stayed, because it carries a real pitfall (`.ts` import extensions in `src/mcp/`). No functionality was removed; the same information is in `docs/`.

Considered and not changed:

- The `project-tools` plugin duplicates the repository's skill and command. That duplication is the cost of packaging; changing it would alter Exercise 5 and the pending Exercise 8 steps. The plugin skills did not appear in the headless `/context` view, so removing them could not be measured.
- The `SessionStart` hook has little value, but Exercise 5 requires one minimal safe hook.

## Measurements

Method: `claude -p "/context" --output-format json`, run from the worktree root in a new session, three times. This is the headless `/context` output (the same method as Exercise 10), not the interactive view. Values are as printed, rounded by the tool.

| State | Total tokens | Memory files | `AGENTS.md` | `CLAUDE.md` | Skills | Custom agents |
| --- | --- | --- | --- | --- | --- | --- |
| Before (commit `6f88aff`) | 19.6k | 2k | 1.9k | 16 | 9.9k | 321 |
| After the `AGENTS.md` trim only | 19.2k | 1.6k | 1.5k | 16 | 9.9k | 321 |
| After the trim plus the `CLAUDE.md` section (final) | 19.4k | 1.8k | 1.5k | 290 | 9.9k | 321 |

A first, longer `CLAUDE.md` section measured 611 tokens and made the total 19.8k, worse than before. It was shortened to the 290-token version above, with the longer reasoning kept in this file. Net result: about 0.2k tokens less than before (19.6k to 19.4k).

## PENDING MANUAL VERIFICATION

The numbers are from headless `/context`. In an interactive session, run `/context` on this branch and confirm the Memory files row is about 1.8k and `CLAUDE.md` about 290 tokens. The interactive view may include other loaded items.
