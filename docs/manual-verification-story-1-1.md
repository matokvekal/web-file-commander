# Story 1.1 — Manual Chrome/Edge verification

The automated tests use a fake folder source, so the real browser folder picker is not covered by them. This checklist covers it. Story 1.1 stays in `review` until every item is checked.

Mark the result and the date at the end.

## Setup

1. Run `npm run dev` and open the printed address in Chrome or Edge (version 86 or later).
2. Prepare a test folder with 3 files and 2 subfolders, and an empty folder.

## Secure context

The folder picker only works in a secure context: `https://` or `http://localhost`.

- [ ] `http://localhost:<port>` works: Select Folder is enabled.
- [ ] Open the app by the machine's network address over plain `http://` (for example `http://192.168.x.x:<port>`; use `npm run dev -- --host`). Select Folder is disabled and the unsupported message is shown.

## Supported browser (Chrome or Edge)

- [ ] On load, the File List shows "Select a folder to start." and the status bar shows "Ready".
- [ ] The Folder Tree and Preview panels are empty.
- [ ] Select Folder opens the system folder picker.
- [x] Choosing the 3 files + 2 subfolders folder lists all 5 entries, subfolders first (bold, trailing `/`), then files, each alphabetical. The status bar shows "5 items".
- [ ] Choosing the empty folder shows "This folder is empty." and "0 items".
- [ ] Choosing a second folder replaces the first list.
- [ ] Cancelling the picker leaves the list and the status bar unchanged and shows no message.

## Unsupported browser

- [ ] In Firefox (or Safari), the File List shows "This browser can't open folders. Use Chrome or Edge on localhost or HTTPS.", Select Folder is disabled, and the app does not crash.

## Result

- Browser and version: Chrome (version not recorded)
- Date: 2026-10-25
- Result: pass. Files and subfolders are displayed correctly in Chrome. The other checklist items were not individually reported and are left unchecked.
