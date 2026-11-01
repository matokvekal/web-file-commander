# Level 5, Exercise 7: file selection and preview in the file-viewer mod

Extends `mods/file-viewer/` (Exercise 6). Folder expansion, the `/file-viewer` command and live reload are unchanged.

## What changed

- `hooks/register.tsx`: file rows are now `Button`s; pressing one stores its path in the `selected` state value. The selected row is drawn inverse. Below the tree the pane shows the path, size and content with line numbers.
- `hooks/viewer.ts` (new): pure helpers with no engine access: path checks, binary detection, size formatting, control-character cleaning and the syntax tokenizer.
- `types/index.d.ts`: adds `selected` to the state contract.
- `src/fileViewerMod.test.ts` (new): 40 unit tests for the helpers (Vitest only collects tests under `src/`).

## Behaviour

- Highlighting and line numbers for TypeScript (`.ts .tsx .mts .cts`), CSS and JSON; other text files show line numbers without colors. At most 500 lines are shown.
- Binary files (a NUL byte, or more than 1% replacement characters, in the first 8 KB) show "Binary file: no preview."
- Files over 200 KB are not read; the pane shows a "too large" message with the size and the limit.
- Any failure while stat-ing or reading shows "This file cannot be read." and never throws.
- File access uses only `$.fs.stat`, `$.fs.read`, `$.fs.list` and `$.session.root`; no Node or shell.

## Path safety

A path is used only if both checks pass, on every redraw (so a crafted stored value is also checked):

1. `isSafePath`: non-empty string up to 512 characters; no leading `/`, backslash, colon (drive letters, streams) or control characters; no empty, `.`, `..` or dots/spaces-only segments; no `.git` or `node_modules` segment.
2. `$.fs.stat(path, { resolve: true })` must give a `realPath` strictly below `$.session.root()` (symlinks and junctions resolved; drive paths compared case-insensitively).

Open folders are checked the same way before they are listed. File names and contents are cleaned of control characters, so escape sequences in a file cannot reach the terminal.

## Security notes

- Read-only: no write, process or network calls.
- The check and the read are two calls, so a file swapped for a link between them is a theoretical race for a local user who already controls the project folder.
- Previews can show secrets that exist in project files (for example `.env`). They are shown to the person only; the mod does not send them to the model.
- Hidden names are hard-coded to `.git` and `node_modules`.

## Verification (2026-11-01)

| Step | Command | Result |
| --- | --- | --- |
| Unit tests | `npx vitest run src/fileViewerMod.test.ts` | passed (traversal, absolute, drive, backslash, NUL, hidden folders, containment, binary, cleaning, tokenizer) |
| Validate | `claude plugin validate mods/file-viewer` | passed (warning: no author; directory-only notes) |
| Type-check | `tsc -p <tsconfig outside the mod>` with the engine's `claude-code.d.ts` | no errors |
| Project check | `npm run check` | passed: lint, 88 tests, build |

The mod was not loaded or executed in a session.

## PENDING MANUAL VERIFICATION

Load from the worktree root: `claude --plugin-dir mods/file-viewer`, then `/file-viewer`. Terminal at least 110 columns wide.

1. Selectable: press `package.json`, then `tsconfig.json`, then a file inside an expanded folder such as `src/App.tsx`. Each press selects that file.
2. Details: the pane shows the path, the size (for example `1.2 KB`) and the content with line numbers.
3. Highlight: the selected row in the tree is drawn inverse; selecting another file moves it.
4. Syntax: `src/App.tsx` (keywords, strings, numbers, comments), `src/App.css` (properties, colors, at-rules) and `package.json` (keys, strings, numbers, true/false/null) show colors. Check that `README.md` shows plain text with line numbers.
5. Binary: expand a folder with an image or other binary (for example build output if present, or create `bin-test.bin` containing a NUL byte) and press it: "Binary file: no preview."
6. Oversized: create a text file over 200 KB (for example `node -e "require('fs').writeFileSync('big.txt','x'.repeat(300000))"`), press it: the "too large" message with the limit. Delete the files afterwards.
7. Unreadable: on a file with no read permission or one locked by another program, press it: "This file cannot be read." and the pane keeps working.
8. Traversal: crafted paths cannot be typed in the UI, so this is covered by the unit tests; optionally confirm that a junction or symlink inside the project pointing outside it shows no outside entries and previews nothing.
9. Excluded: `.git` and `node_modules` still do not appear.
10. Exercise 6 behaviour: folders still expand and collapse and stay open while selecting files.
11. Live reload: change a message in `hooks/register.tsx` or `hooks/viewer.ts`, save, and wait for the turn to end. The pane redraws without restarting, keeping the selected file and open folders.
12. Scrolling: with a long file selected, the arrow keys scroll the pane.
