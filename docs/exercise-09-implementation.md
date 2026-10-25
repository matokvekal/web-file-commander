# Exercise 9 — Implementation of Epic 1

**Commits:** `77e5936` (Story 1.1), `443af15` (Story 1.1 done), `0e30cb3` (Story 1.2), `49df05b` (Story 1.3).

## Stories

| Story | What it adds | Status |
| --- | --- | --- |
| 1.1 Select a folder and see its entries | `src/access/` port with browser and fake adapters, `useFolderBrowser`, Select Folder button, sorted File List, empty and start messages, unsupported-browser message | done |
| 1.2 Loading and access-denied feedback | loading state and "Loading…", "Access Denied", live region, latest-request-wins | review |
| 1.3 Open subfolders and go back | `openFolder` on the port, folder name and Back button, click or Enter to open, keyboard focus on rows | review |

## Decisions

- Unsupported browser: the message is "This browser can't open folders. Use Chrome or Edge on localhost or HTTPS." and Select Folder is disabled.
- Cancelling the picker changes nothing and shows no message. It is not treated as a denial.
- The architecture spine was updated when Story 1.3 added `openFolder` and a folder name to the port.

## Test results

`npm run check` passes: lint, 27 tests (24 for the app and architecture guards, 3 for project rules) and the production build.

## Manual verification

- Story 1.1: I reported that Chrome displayed files and subfolders correctly. The other checklist items were not individually reported and stay unchecked (`docs/manual-verification-story-1-1.md`).
- Stories 1.2 and 1.3: **not yet verified in a browser.** Checklists are in `docs/manual-verification-story-1-2.md` and `-1-3.md`. That is why both stories are `review`, not `done`.
