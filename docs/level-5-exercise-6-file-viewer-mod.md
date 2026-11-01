# Level 5, Exercise 6: file-viewer mod

A Claude Code mod in `mods/file-viewer/` that shows the project tree in a pane beside the chat.

## Files

- `.claude-plugin/plugin.json`: manifest, names the state contract `./types/index.d.ts`.
- `hooks/hooks.json`: `{ "modules": ["./register.tsx"] }`.
- `hooks/register.tsx`: the mod module.
- `types/index.d.ts`: contract for the `openDirs` state value (required by the engine for `$.state`).

## Behaviour

- `session.start` registers the slash command `/file-viewer`; a `command.run` hook opens the pane `file-viewer`.
- A separate `ui.render` hook (`component: 'Pane'`, `requestId: 'file-viewer'`) draws the tree.
- Folders are listed before files, each group sorted by name. `.git` and `node_modules` are excluded; symlinks and other entry kinds are skipped.
- A folder row is a `Button`; pressing it expands or collapses it. The open folders are kept in the `openDirs` state value, so they survive redraws and hot reloads.
- File sizes are shown as B, KB or MB. The tree stops at 300 rows.
- The only filesystem access is `$.fs.list`; no Node, shell, process, write or network calls.

## Load and test

Needs a Claude Code session started from the repository root (or this worktree root) with the mod folder as a plugin folder:

```
claude --plugin-dir mods/file-viewer
```

Then:

1. Run `/file-viewer`. A pane titled "Files" should open beside the chat.
2. Press a folder row (for example `src/`). Its children appear and the arrow changes to open; press again to collapse. Expand two folders, collapse one, and check the other stays open.
3. Check that `.git` and `node_modules` never appear and that files show sizes.
4. Live redraw: change the title text or `formatSize` output in `hooks/register.tsx`, save, and wait for the turn to end. The pane should redraw with the change and the open folders should stay open, without restarting Claude Code.

## Verification (2026-11-01)

| Step | Command | Result |
| --- | --- | --- |
| Validate | `claude plugin validate mods/file-viewer` | first run failed: contract file had a top-level `export {}`; replaced by an exported type; second run passed (warning: no author; directory-only notes: LICENSE, icon) |
| Type-check | `tsc -p <tsconfig outside the mod>` with the engine's `claude-code.d.ts` | no errors |
| Project check | `npm run check` | passed: lint, 48 tests, build |

The mod was not loaded or executed in any session while this was written.

## PENDING MANUAL VERIFICATION

All of the "Load and test" steps above: the pane opening, folder press expand and collapse, preserved open state, excluded folders, sizes, and live redraw on save. None was run.
