# Addendum: Architecture Inputs (unconfirmed)

These are technical options raised while drafting the brief. They are **not decisions**. They are inputs for the architecture phase, which may confirm, change, or reject them.

## Unconfirmed technical options

1. **Browser-only delivery with no backend, using the browser's own folder-picker permission (was A3).** The existing project is a front-end app with no backend. Folder selection and the access-denied case would map to the browser's permission prompt. Open question: is a browser-provided folder picker the right mechanism?
2. **Tests may use simulated folder data and delays (was A6).** `docs/requirements.md` asks for a "simulated loading delay" and for folders of known contents, which suggests fake folder data in tests. This would relax the earlier layout-stage rule against mock data, for tests only. Open question: how are folders faked, and does any mock data ship in the app?
3. **No native apps; browser support limited by the folder-picker API (was A9).** Browser folder-picker APIs are not available in every browser, which could limit who can use the app. Open question: which browsers must be supported, and what happens in an unsupported one?

## Status

Unconfirmed. Do not treat any of the above as approved.
