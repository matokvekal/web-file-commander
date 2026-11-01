@AGENTS.md

## Why each extension uses its mechanism

Lightest mechanism that works; details in `docs/level-5-exercise-11-lightest-rung.md`.

- Rules: always loaded, so short; exercise notes stay in `docs/`.
- `/project-check`: command; one fixed prompt, no script.
- `pre-commit-check`: skill; bundles a script, loads only when relevant.
- `project-reviewer`: subagent; only an agent can enforce a tool limit.
- `review-with-agent`: forked skill on that agent; keeps review output out of the main context.
- `project-files`: the only MCP server; each extra server adds tools to every session.
- Plugins and hook: packaging only; the hook is the smallest safe one.
- `mods/file-viewer`: mod; no other mechanism can draw a pane.
