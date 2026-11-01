# Level 5, Exercise 5: local plugin and marketplace

The `pre-commit-check` skill and the `/project-check` command are packaged as the plugin `project-tools` in a local marketplace. The originals in `.claude/skills/pre-commit-check/` and `.claude/commands/project-check.md` are unchanged.

## Layout

```
.claude/settings.json                              extraKnownMarketplaces -> "." and enabledPlugins (Exercise 8)
.claude-plugin/marketplace.json                    marketplace "local-marketplace" (moved to the repo root in Exercise 8; lists project-tools and mods/file-viewer)
local-marketplace/plugins/project-tools/
  .claude-plugin/plugin.json
  skills/pre-commit-check/   copy of the skill (script path uses ${CLAUDE_SKILL_DIR})
  commands/project-check.md  copy of the command
  hooks/hooks.json           SessionStart hook: echo project-tools plugin loaded
```

All paths are relative. The hook only prints one line; it reads and writes nothing.

## Teammate setup

After cloning, Claude Code offers the `local-marketplace` marketplace from the committed `.claude/settings.json`. Since Exercise 8 the committed settings also enable both plugins; see `docs/level-5-exercise-8-fresh-clone.md`.

## Notes

- The plugin copy of the skill uses the current working-tree `SKILL.md` description, which differs from the committed original (the original file is untouched by this exercise).
- With the plugin enabled the skill and command exist twice: plugin names are namespaced `project-tools:...`, the originals are not.
- The plugin command is invoked as `/project-tools:project-check <file> <focus>`.

## Verification (run on 2026-11-01)

| Step | Command | Result |
| --- | --- | --- |
| Validate marketplace | `claude plugin validate local-marketplace` | passed, no warnings |
| Validate plugin | `claude plugin validate local-marketplace/plugins/project-tools` | passed; only directory-submission notes (LICENSE, icon) |
| Add and install | `claude plugin marketplace add ./local-marketplace --scope local`, `claude plugin install project-tools@local-marketplace --scope local` | succeeded, status enabled |
| Components | `claude plugin details project-tools@local-marketplace` | 2 skills (pre-commit-check, project-check), 1 hook |
| Command | `claude -p "/project-tools:project-check src/main.tsx maintainability"` | review produced |
| Skill | `claude -p "/project-tools:pre-commit-check"` | ran the script, verdict ready |
| Disable | `claude plugin disable project-tools@local-marketplace --scope local` | status disabled; `/project-tools:project-check` reported "isn't installed in this session" |
| Enable | `claude plugin enable ...`, then a new `claude -p` process | status enabled; command works again |
| Cleanup | `claude plugin uninstall ...`, `claude plugin marketplace remove local-marketplace` | done |
| Project check | `npm run check` | passed: lint, 48 tests, build |

## PENDING MANUAL VERIFICATION

- Interactive session: run `/reload-plugins` after disable and enable and confirm `/project-tools:project-check` leaves and returns in the slash-command menu. Only fresh headless processes were tested.
- Confirm the marketplace is offered by the trust prompt after a fresh clone (not tested).
- Confirm the SessionStart hook line appears in an interactive session (not observed in headless runs).
- `/project-tools:project-check` with no arguments printed nothing in headless mode; the usage message was not seen.
