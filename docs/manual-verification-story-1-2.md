# Story 1.2 — Manual Chrome/Edge verification

The automated tests use a fake folder source. This checklist covers the real browser. Story 1.2 stays in `review` until it is done.

## Setup

Run `npm run dev` and open `http://localhost:<port>` in Chrome or Edge.

## Loading

- [ ] Select a large folder (thousands of files, for example `node_modules` of a project). While it reads, the File List shows "Loading…" and the status bar shows "Loading…". Both are replaced by the list when it is ready. (A small folder may load too fast to see the text.)

## Access denied (best effort)

Chrome decides what it shows for folders it blocks, so the result may differ from the expected one.

- [ ] Try to select a folder Chrome refuses (for example a system folder such as the drive root or `C:\Windows`). If the app receives a refusal, the File List shows **Access Denied** in bold with no entries, and the status bar shows "Access denied".
- [ ] After a denial, Select Folder still works and a normal folder loads.
- [ ] If Chrome only shows its own "can't open this folder" dialog and never returns to the app, note that here. It is not an app failure.

## Cancel

- [ ] With a list on screen, open Select Folder and cancel the picker. The list and the status bar stay as they were, and no Access Denied message appears.

## Result

- Browser and version:
- Date:
- Result (pass / fail, with notes):
