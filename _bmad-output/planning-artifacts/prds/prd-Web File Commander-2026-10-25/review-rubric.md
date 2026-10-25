# PRD Quality Review — Web File Commander

## Overall verdict
This is a right-sized, honest hobby PRD. It is technology-free, every FR has testable consequences tied to the three acceptance tests, scope and non-goals are explicit, and assumptions are indexed and approved. The risks are small: access denial is defined only as a user action, the no-parent behaviour in FR-6 allows two outcomes, and SM-2 is not measurable.

## Decision-readiness — adequate
Decisions are stated as decisions (A1-A5 approved, FR-6 added). Open Questions 1-3 carry defaults, owners or deferral points, so they are genuinely open rather than rhetorical. Nothing blocks UX or architecture.

## Substance over theater — strong
Two named journeys that each drive a requirement (UJ-1 drives FR-1/2/3/6, UJ-2 drives FR-5). No innovation or NFR theater. The Vision is generic in places ("calmly") but is short.

### Findings
- **low** Vision wording is soft (§1) — "browsing a folder clearly and calmly" could fit any browser. *Fix:* Replace with the concrete promise: the user always knows whether the folder is loading, empty, blocked, or shown.

## Strategic coherence — adequate
The thesis (a read-only browser that always explains its state) is stated and the five features follow from it. SM-1 maps to the acceptance tests. The counter-metric is vague.

### Findings
- **low** Counter-metric not measurable (§7 SM-C1) — "Number of features" has no threshold. *Fix:* State it as: no write operations (edit, delete, move, upload) or preview exist in v2.

## Done-ness clarity — adequate
Every FR has testable consequences, and FR-2, FR-4 and FR-5 quote the requirements tests. Gaps are an either/or outcome in FR-6 and an unmeasurable SM-2.

### Findings
- **medium** FR-6 allows two outcomes at the top level (FR-6 third bullet) — "not offered or has no effect" gives two different pass conditions, so a test cannot be written. *Fix:* Pick one (default: go-back is not offered), and align it with Open Question 1.
- **medium** SM-2 is not measurable (§7 SM-2) — "without any explanation" has no observer, task or pass criterion, even though A5 accepts informality. *Fix:* Define a simple check: product owner completes select, open subfolder, go back in one attempt, unaided.
- **medium** Access denial covers only a user action (FR-5, UJ-2) — "If the user denies access" leaves out access that is refused for any other reason (for example system permissions). The product behaviour should be the same. *Fix:* Reword to "If access to a Folder is refused, for any reason" and keep the user-denial case as the tested example.

## Scope honesty — strong
Non-Goals, MVP in/out, per-FR out-of-scope notes, and an approved Assumptions Index make omissions explicit. Open-item count (3 questions, 5 assumptions) is proportionate for a hobby PRD.

## Downstream usability — adequate
Glossary exists and FR, UJ and SM IDs resolve. Small drift and ordering issues remain (see mechanical notes). A story author can extract FR-1 to FR-6 cleanly.

### Findings
- **low** Glossary terms used in lowercase (§2.3 UJ-1/UJ-2, FR-2) — "folder", "subfolder", "loading indicator" and "access-denied message" appear in lowercase prose, and "subfolder" is not a Glossary term. *Fix:* Capitalise glossary terms in journeys, and add Subfolder to the Glossary or define it under Entry.

## Shape fit — strong
A short capability-spec shape with two light journeys suits a hobby, single-purpose app.

## Mechanical notes
- FR order in the document is FR-1, 2, 3, 6, 4, 5 (IDs are stable and unique, but reading order is not sequential). Optionally move FR-6 after FR-5 or leave as is.
- Assumptions Index roundtrip: A3 is in the index but not referenced inline (it was replaced by FR-6). A1 index entry cites "(3, 6.2)", which is ambiguous; use "§3, §6.2".
- Both UJs have named protagonists (Dana, Sam). All cross-references to FR-1..FR-6, UJ-1, UJ-2, SM-1, SM-2, SM-C1 resolve.
