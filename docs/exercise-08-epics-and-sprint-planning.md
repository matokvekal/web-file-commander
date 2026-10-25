# Exercise 8 — Epics, stories and sprint planning

**Commits:** `d43d6fc` (epics and stories), `e57080e` (marked final, assumptions listed), `8a883d8` (sprint status).
**Files:** `_bmad-output/planning-artifacts/epics.md`, `_bmad-output/implementation-artifacts/sprint-status.yaml`.

## Epics and stories

I asked for a small scope of 2 to 3 stories with testable acceptance criteria that respect AD-1 to AD-8. The result is one epic, "Browse a Folder", with three ordered stories:

1. **Story 1.1** — select a folder and see its entries (FR-1, FR-2).
2. **Story 1.2** — loading and access-denied feedback (FR-4, FR-5).
3. **Story 1.3** — open subfolders and go back (FR-3, FR-6).

Every PRD requirement and the read-only constraint is covered, and no story depends on a later one. I approved the document as final and asked to keep the four architecture assumptions (A1 to A4) documented in it.

## Sprint planning

- Readiness result: **CONCERNS**, minor and not blocking:
  1. the unsupported-browser message had no wording;
  2. the real browser adapter has no automated test, so it needs a manual check, and the secure-context requirement is unverified;
  3. the PRD still listed two open questions that the architecture had settled.
- `sprint-status.yaml` was created with Epic 1 and the three stories at `backlog`.
- I resolved concern 1 in Story 1.1 and added manual verification checklists for the stories (`docs/manual-verification-story-1-*.md`).
