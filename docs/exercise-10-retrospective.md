# Exercise 10 — Retrospective

**Commit:** `af30651`.
**Full document:** `_bmad-output/implementation-artifacts/epic-1-retro-2026-10-25.md`.

## Verdict

**Rejected** (machine verdict). Stories 1.2 and 1.3 are still `review`, waiting for manual browser verification, and unfinished stories force this verdict. The automated side is clean: `npm run check` passes with no blocking findings. If the manual checks pass, the epic can be accepted with open items. That decision is mine.

## Main findings

- The real browser adapter has no automated test, and only part of Story 1.1 has been checked in Chrome.
- Folder rows have no accessible role (`src/App.tsx`).
- The status bar says "1 items" for one entry, following the UX text literally. Accepted for now.
- The PRD still lists two open questions that the architecture settled.
- `App.test.tsx` mixes UI, state and guard tests in one file.

## Action items (proposed, in `sprint-status.yaml`)

1. Run the manual Chrome/Edge checks for Stories 1.1 (remaining items), 1.2 and 1.3.
2. Give folder rows an accessible role.
3. Update the PRD open questions 1 and 3.
4. Split `App.test.tsx` into per-unit files.
5. Write multi-line files with the file tools and check `git status` (see Exercise 11).

## Limits

I did not exercise the app in a real browser during the retrospective, no session logs or earlier retrospective existed, and `bmad-review` was not run. The diff was reviewed inline.
