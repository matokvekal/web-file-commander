# Exercise 6 — PRD and UX

**Result:** final PRD, validated, and a UX pair (`DESIGN.md`, `EXPERIENCE.md`).
**Commits:** `5bf2006` (PRD final), `f95a29a` (validation fixes and reports), `847da1d` (UX).
**Files:** `_bmad-output/planning-artifacts/prds/prd-Web File Commander-2026-10-25/` and `.../ux-designs/ux-Web File Commander-2026-10-25/`.

## PRD

- Fast path, built from the brief and `docs/requirements.md`. Six functional requirements: select a folder (FR-1), show entries (FR-2), open a subfolder (FR-3), loading indicator (FR-4), access-denied message (FR-5), go back to the parent folder (FR-6).
- I approved assumptions A1, A2, A4 and A5. I changed A3: the first draft left out going back to the parent folder, and I asked for basic navigation back with a testable requirement. That became FR-6.
- Validation grade: **Good**, with no critical or high findings, 3 medium and 3 low. I had the 3 medium ones fixed:
  - FR-6 had two possible outcomes at the top-level folder; it is now "Back is not offered".
  - SM-2 was not measurable; it is now one unaided attempt by the product owner.
  - FR-5 only covered a user denying access; it now covers access refused for any reason.
- The 3 low findings (soft vision wording, vague counter-metric, lowercase glossary terms) are open.

## UX

- Fast path. I asked to keep the existing simple grey style and the current three-panel layout and status bar.
- `DESIGN.md` records the current grey tokens and a few additions (bold folders with a trailing `/`, a button style, plain-text messages). `EXPERIENCE.md` covers the layout, messages, states, keyboard and accessibility basics, and the two journeys.
- I chose to finalize with the unresolved choices still marked as assumptions (U1 to U8, D1 to D3). No reviewer pass was run.
