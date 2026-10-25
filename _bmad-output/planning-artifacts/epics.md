---
status: final
stepsCompleted: [step-01, step-02, step-03, step-04]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-Web File Commander-2026-10-25/prd.md
  - _bmad-output/planning-artifacts/architecture/architecture-Web File Commander-2026-10-25/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-Web File Commander-2026-10-25/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-Web File Commander-2026-10-25/EXPERIENCE.md
---

# Web File Commander - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Web File Commander, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: The user can perform Folder Selection to choose any Folder they have access to; the chosen Folder becomes the Selected Folder, and selecting a different Folder replaces the previous Entries.
FR2: When a Folder is selected, the File List displays all of its Entries, showing each Entry's name and whether it is a file or a subfolder. A Folder with 3 files and 2 subfolders shows all 5; none omitted or duplicated; an empty Folder shows an empty-folder message.
FR3: The user can open a subfolder shown in the File List, making it the Selected Folder and displaying its Entries, with the same loading and access-denied behavior as FR4 and FR5.
FR4: While the Entries of a Selected Folder are being retrieved, the app displays a Loading Indicator that disappears when loading completes.
FR5: If access to a Folder is refused, for any reason, the app displays an Access-Denied Message ("Access Denied" when the user denies access), does not crash, shows no Entries of the refused Folder, and lets the user perform Folder Selection again.
FR6: The user can go back from the Selected Folder to its Parent Folder, which becomes the Selected Folder with its Entries displayed, with the same loading and access-denied behavior. Going back is not offered at the originally chosen Folder.

### NonFunctional Requirements

NFR1: The app is read-only; it never edits, deletes, moves, or uploads files (PRD Non-Goals, brief constraint).

The PRD defines no other cross-cutting NFRs.

### Additional Requirements

- AR1 (AD-1): Folder access uses the browser folder picker (`showDirectoryPicker`) in read mode, Chromium only (Chrome/Edge 86+), no fallback. If the API is missing, show a "browser not supported" message. [Assumption: message text and placement not in UX yet.]
- AR2 (AD-2): Only `src/access/` touches browser file APIs, behind a read-only `FolderAccess` port with no write operations.
- AR3 (AD-3): The port returns `Entry = { name, kind: 'file' | 'folder' }` and an opaque `FolderRef`; entries are returned unsorted.
- AR4 (AD-4): Port calls never throw. Results are `ok`, `denied` (permission refusal and any other read failure), or `cancelled` (picker cancelled: no change, no message).
- AR5 (AD-5): `useFolderBrowser` in `src/state/` is the single state owner (path stack, status `idle | loading | loaded | empty | denied`, entries) with actions `selectFolder`, `openFolder`, `goBack`. Status bar text is derived from this state.
- AR6 (AD-6): Each load has a request number; results from superseded requests are ignored.
- AR7 (AD-7): Entries are sorted once in the state layer: subfolders first, then files, each alphabetical.
- AR8 (AD-8): `App` receives its `FolderAccess` by prop or context; tests use `fakeFolderAccess` (in-memory tree, configurable delay and denial) and never call the real browser API.
- AR9: No starter template; the existing React + TypeScript + Vite project is used as is. No backend.
- AR10 (Assumption A4): The folder picker needs a secure context (HTTPS or localhost); not yet verified.

### UX Design Requirements

UX-DR1: A **Select Folder** button in the header opens folder selection.
UX-DR2: The File List panel shows the Selected Folder's name and a **Back** button above the list; Back is hidden at the originally chosen Folder.
UX-DR3: Entry rows: folders are bold with a trailing `/`, files are regular; hover and keyboard focus use the `surface-title` grey background; clicking a folder row or pressing Enter opens it; file rows do nothing in v2.
UX-DR4: File List panel messages: "Select a folder to start.", "Loading…", "Access Denied" (bold), "This folder is empty." A denied folder clears the previous list.
UX-DR5: Status bar text follows the state: "Ready", "Loading…", "Access denied", "N items" ("1 item" for a single entry).
UX-DR6: Keep the existing grey style and tokens from `DESIGN.md`: no new colors, icons, shadows, or fonts; buttons use grey fill, 1px border, square corners, visible focus outline.
UX-DR7: Keyboard: Tab moves through Select Folder, Back, and the entry rows; Enter opens a folder row; no other shortcuts.
UX-DR8: Accessibility: text contrast at least 4.5:1; loading, empty, and denied messages announced through a polite live region; state never shown by color alone.
UX-DR9: Desktop width only. Folder Tree and Preview panels stay as empty placeholders.

### Open Assumptions (from the architecture spine)

- A1: Settled in Story 1.1: the unsupported-browser message is "This browser can't open folders. Use Chrome or Edge on localhost or HTTPS." (File List panel, Select Folder disabled).
- A2: Cancelling the folder picker is not a denial: no change, no message (AR4, Story 1.1).
- A3: Entry order follows UX U5 (subfolders first, then files, each A-Z); PRD Open Question 2 stays open (AR7, Story 1.1).
- A4: The folder picker needs a secure context (HTTPS or localhost); not yet verified (AR10).

### FR Coverage Map

FR1: Epic 1 (Story 1.1) - Select a Folder
FR2: Epic 1 (Story 1.1) - Display Entries, empty-folder message
FR3: Epic 1 (Story 1.3) - Open a subfolder
FR4: Epic 1 (Story 1.2) - Loading Indicator
FR5: Epic 1 (Story 1.2) - Access-Denied Message
FR6: Epic 1 (Story 1.3) - Go back to the Parent Folder
NFR1: Epic 1 (Story 1.1) - read-only access layer

## Epic List

### Epic 1: Browse a Folder

Users can choose a Folder, see its files and subfolders with clear loading and access feedback, open subfolders, and go back to the Parent Folder.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6

One epic with three ordered stories: the stories share the same few files (`src/access/`, `src/state/`, `App.tsx`), the design is already settled in the architecture spine and UX documents, and an early split would not change direction.

## Epic 1: Browse a Folder

Users can choose a Folder, see its files and subfolders with clear loading and access feedback, open subfolders, and go back to the Parent Folder.

### Story 1.1: Select a Folder and see its Entries

As a user,
I want to select a Folder and see its files and subfolders,
So that I can tell what is in it.

Covers FR1, FR2, NFR1; AR1 to AR5, AR7, AR8, AR9; UX-DR1, UX-DR3 (display only), UX-DR4 (start and empty messages), UX-DR5 (Ready, N items), UX-DR6, UX-DR9.

**Acceptance Criteria:**

**Given** the app is open and nothing is selected
**When** the page loads
**Then** the File List shows "Select a folder to start." and the status bar shows "Ready"
**And** the header has a Select Folder button, and the Folder Tree and Preview panels are empty placeholders

**Given** a fake folder with 3 files and 2 subfolders
**When** the user selects it through Select Folder
**Then** the File List shows all 5 Entries once each, subfolders first then files, each alphabetical, with subfolders in bold with a trailing `/`
**And** the status bar shows "5 items"

**Given** a fake folder with no Entries
**When** the user selects it
**Then** the File List shows "This folder is empty." and the status bar shows "0 items"

**Given** the user already has a Selected Folder
**When** they select a different Folder
**Then** the File List shows only the new Folder's Entries

**Given** the user cancels the folder picker
**When** the picker closes
**Then** the previous state is unchanged and no message appears

**Given** the browser has no `showDirectoryPicker`
**When** the app loads
**Then** the File List shows "This browser can't open folders. Use Chrome or Edge on localhost or HTTPS." and Select Folder is disabled
**And** the app does not crash

**Given** the code under `src/access/`
**When** it is reviewed
**Then** `FolderAccess` has read operations only, only `src/access/` references browser file APIs, and tests use `fakeFolderAccess` injected into `App`
**And** `npm run check` passes

### Story 1.2: Show loading and access-denied feedback

As a user,
I want to see when a Folder is loading or when access is refused,
So that I am never left guessing.

Covers FR4, FR5; AR4, AR6; UX-DR4 (Loading and Access Denied), UX-DR5 (Loading, Access denied), UX-DR8.

**Acceptance Criteria:**

**Given** a fake folder with a loading delay
**When** the user selects it
**Then** the File List shows "Loading…" and the status bar shows "Loading…" while the delay runs
**And** both disappear when loading completes and the Entries are shown

**Given** a fake folder that refuses access
**When** the user selects it
**Then** the File List shows "Access Denied" in bold with no Entries, and the status bar shows "Access denied"
**And** any previous list is cleared and the app does not crash

**Given** access was refused
**When** the user clicks Select Folder again and picks a readable Folder
**Then** the Entries load normally

**Given** a fake read failure of any other kind
**When** the user selects that Folder
**Then** the same Access Denied message is shown

**Given** two loads where the first finishes after the second
**When** both complete
**Then** only the second load's result is shown

**Given** a loading, empty, or denied message appears
**When** a screen reader is in use
**Then** the message is in a polite live region, and the state is also told apart by text, not color alone

### Story 1.3: Open subfolders and go back

As a user,
I want to open a subfolder and go back to its Parent Folder,
So that I can browse around without selecting again.

Covers FR3, FR6; AR3, AR5; UX-DR2, UX-DR3 (opening), UX-DR7.

**Acceptance Criteria:**

**Given** a loaded Folder containing a subfolder
**When** the user clicks the subfolder row or focuses it and presses Enter
**Then** the File List shows that subfolder's Entries, with its name and a Back button above the list

**Given** a file row
**When** the user clicks it
**Then** nothing happens

**Given** the user opened a subfolder
**When** they click Back
**Then** the File List shows the Entries of the Folder it was opened from, and Back is hidden once the originally chosen Folder is shown again

**Given** the originally chosen Folder is shown
**When** the page is viewed
**Then** no Back button is offered

**Given** a subfolder that is slow or refuses access
**When** the user opens it, or goes back to a Folder that refuses access
**Then** Loading… and Access Denied behave as in Story 1.2

**Given** the keyboard
**When** the user presses Tab
**Then** focus moves through Select Folder, Back (when shown), and the entry rows with a visible focus outline
**And** `npm run check` passes
