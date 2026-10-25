# Story 1.3 — Manual Chrome/Edge verification

Not yet performed. Story 1.3 stays in `review` until this is done. The automated tests use a fake folder source.

## Setup

Run `npm run dev` and open `http://localhost:<port>` in Chrome or Edge. Prepare a folder with at least two levels of subfolders.

## Checks

- [x] After selecting the folder, the File List shows its name above the list and no Back button.
- [x] Clicking a subfolder row opens it: its name and a Back button appear and its entries are listed.
- [x] Focusing a subfolder button with Tab and pressing Enter opens it.
- [x] Clicking a file row does nothing.
- [x] Back returns to the folder the subfolder was opened from. After going back to the folder originally chosen, Back disappears.
- [ ] Tab order is Select Folder, Back (when shown), then the entry rows, each with a visible focus outline. **Unverified.**
- [ ] If a subfolder cannot be read, "Access Denied" is shown and Back still works. (Best effort; hard to trigger on a normal folder.) **Unverified.**

## Result

- Browser and version:
- Date:
- Result (pass / fail, with notes):
