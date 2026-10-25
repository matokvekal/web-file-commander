# Validation Report — Web File Commander

- **PRD:** `_bmad-output/planning-artifacts/prds/prd-Web File Commander-2026-10-25/prd.md`
- **Rubric:** `.claude/skills/bmad-prd/assets/prd-validation-checklist.md`
- **Run at:** 2026-10-25T20:40:59+02:00
- **Grade:** Good

> Status: the 3 medium findings were fixed in the PRD on 2026-10-25 (FR-6 top-level behavior, SM-2 check, FR-5 refusal reasons). The 3 low findings are open.

## Overall verdict
This is a right-sized, honest hobby PRD. It is technology-free, every FR has testable consequences tied to the three acceptance tests, scope and non-goals are explicit, and assumptions are indexed and approved. The risks are small: access denial is defined only as a user action, the no-parent behaviour in FR-6 allows two outcomes, and SM-2 is not measurable.

## Dimension verdicts
- Decision-readiness — adequate
- Substance over theater — strong
- Strategic coherence — adequate
- Done-ness clarity — adequate
- Scope honesty — strong
- Downstream usability — adequate
- Shape fit — strong

## Findings by severity

### Critical (0)
### High (0)
### Medium (3)
**[Done-ness clarity]** — FR-6 allows two outcomes at the top level (FR-6 third bullet)
"not offered or has no effect" gives two different pass conditions, so a test cannot be written.
Fix: Pick one (default: go-back is not offered), and align it with Open Question 1.

**[Done-ness clarity]** — SM-2 is not measurable (§7 SM-2)
"without any explanation" has no observer, task or pass criterion, even though A5 accepts informality.
Fix: Define a simple check: product owner completes select, open subfolder, go back in one attempt, unaided.

**[Done-ness clarity]** — Access denial covers only a user action (FR-5, UJ-2)
"If the user denies access" leaves out access that is refused for any other reason (for example system permissions). The product behaviour should be the same.
Fix: Reword to "If access to a Folder is refused, for any reason" and keep the user-denial case as the tested example.

### Low (3)
**[Substance over theater]** — Vision wording is soft (§1)
"browsing a folder clearly and calmly" could fit any browser.
Fix: Replace with the concrete promise: the user always knows whether the folder is loading, empty, blocked, or shown.

**[Strategic coherence]** — Counter-metric not measurable (§7 SM-C1)
"Number of features" has no threshold.
Fix: State it as: no write operations (edit, delete, move, upload) or preview exist in v2.

**[Downstream usability]** — Glossary terms used in lowercase (§2.3 UJ-1/UJ-2, FR-2)
"folder", "subfolder", "loading indicator" and "access-denied message" appear in lowercase prose, and "subfolder" is not a Glossary term.
Fix: Capitalise glossary terms in journeys, and add Subfolder to the Glossary or define it under Entry.

## Mechanical notes
- FR order in the document is FR-1, 2, 3, 6, 4, 5 (IDs are stable and unique, but reading order is not sequential). Optionally move FR-6 after FR-5 or leave as is.
- Assumptions Index roundtrip: A3 is in the index but not referenced inline (it was replaced by FR-6). A1 index entry cites "(3, 6.2)", which is ambiguous; use "§3, §6.2".
- Both UJs have named protagonists (Dana, Sam). All cross-references to FR-1..FR-6, UJ-1, UJ-2, SM-1, SM-2, SM-C1 resolve.

## Reviewer files
- `review-rubric.md`
