# Exercise 7 — Architecture spine

**Result:** architecture spine with eight decisions, committed as `1f2bf5e`.
**File:** `_bmad-output/planning-artifacts/architecture/architecture-Web File Commander-2026-10-25/ARCHITECTURE-SPINE.md`.

## What I decided

- The access mechanism is the browser folder picker API, Chromium only (Chrome/Edge) for v2, with no fallback. I approved this after the assistant compared it with a plain `<input webkitdirectory>`, which works in every browser but never gives a real denial or lazy loading.
- The access layer stays separate and testable. The spine uses ports and adapters: the UI talks to one state owner, which talks to a read-only `FolderAccess` port with a browser adapter and a fake adapter.
- Decisions are numbered AD-1 to AD-8: browser picker (AD-1), only `src/access/` touches browser file APIs (AD-2), plain data types and opaque folder references (AD-3), one result type for failures (AD-4), one state owner with a path stack for Back (AD-5), latest request wins (AD-6), sorting in the state layer (AD-7), tests inject a fake (AD-8).

## Checks and limits

- The spine linter found nothing. I did not run the reviewer gate.
- Browser support was checked against one web.dev page (Chrome/Edge 86+, Firefox/Safari not supported). The page is undated, so I did not confirm the 2026 status.
- Four assumptions stay open: the unsupported-browser message (A1, settled later in Story 1.1), cancelling the picker is not a denial (A2), entry order (A3), and the secure-context requirement (A4, unverified).
