---
name: Web File Commander
status: final
sources:
  - _bmad-output/planning-artifacts/prds/prd-Web File Commander-2026-10-25/prd.md
updated: 2026-10-25
---

# Web File Commander — Experience Spine

Visual identity is in `DESIGN.md`. Terms (Folder, Entry, Selected Folder, Parent Folder, File List) follow the PRD Glossary. Assumptions are tagged `[ASSUMPTION U#]` and indexed at the end.

## Foundation

Single-screen web app, desktop width. Keeps the current layout: header, three panels (Folder Tree, File List, Preview), status bar. In v2 only the File List is active. Folder Tree and Preview stay as empty placeholders (PRD A1, non-goal). No UI library.

## Information Architecture

| Surface | Purpose | Realizes |
|---|---|---|
| Header | App name and the **Select Folder** button. [ASSUMPTION U1] | FR-1 |
| Folder Tree panel | Placeholder, empty | — |
| File List panel | Shows the Selected Folder's name, the **Back** button, and its Entries, or a loading, empty or denied message. [ASSUMPTION U2] | FR-2, 3, 4, 5, 6 |
| Preview panel | Placeholder, empty | — |
| Status bar | One short line describing the current state | FR-4, 5 |

## Voice and Tone

Short, plain, no exclamation marks.

| Situation | Text |
|---|---|
| Nothing selected | "Select a folder to start." |
| Loading | "Loading…" |
| Access refused | "Access Denied" |
| Empty folder | "This folder is empty." |
| Status bar | "Ready", "Loading…", "Access denied", "N items" |

## Component Patterns

| Component | Behavior |
|---|---|
| Select Folder button | Opens the system folder choice. The chosen Folder replaces the Selected Folder. |
| Entry row | Folder rows open on click or Enter. File rows do nothing in v2 (no preview). [ASSUMPTION U3] |
| Back button | Shown in the File List panel above the list. Not shown when the Selected Folder is the originally chosen Folder (FR-6). [ASSUMPTION U4] |
| Entry order | Subfolders first, then files, each A–Z. [ASSUMPTION U5; PRD Open Question 2 stays open] |

## State Patterns

| State | File List panel | Status bar |
|---|---|---|
| Empty (start) | "Select a folder to start." | Ready |
| Loading | "Loading…" in place of the list | Loading… |
| Loaded | Entries | N items |
| Empty folder | "This folder is empty." | 0 items |
| Denied | "Access Denied" (bold), no Entries | Access denied |
| Unsupported browser | "This browser can't open folders. Use Chrome or Edge on localhost or HTTPS." (plain text, Select Folder disabled) | Ready |

After a denied state the Select Folder button still works. The message replaces the previous list. [ASSUMPTION U8] Loading indicator is text only. [ASSUMPTION U6: no spinner or animation.]

## Interaction Primitives

- Mouse: click a folder row to open it; click Back to go up; click Select Folder to choose.
- Keyboard: Tab moves through Select Folder, Back, and the entry rows; Enter opens a folder row. [ASSUMPTION U7: no extra shortcuts such as Backspace for Back.]
- No drag and drop, no context menus, no multi-select.

## Accessibility Floor

- Everything is reachable and usable by keyboard, with a visible focus outline.
- Text contrast stays at or above 4.5:1 (the current greys meet this on white and on the bar greys).
- Loading, empty and denied messages are announced to screen readers (polite live region).
- State is never shown by color alone.

## Key Flows

**Dana looks inside a folder (UJ-1).** Dana opens the app and sees "Select a folder to start." She clicks Select Folder and picks Documents. The panel shows "Loading…", then the list: subfolders in bold first, then files. The status bar reads "12 items". She clicks a subfolder, sees its contents, then clicks Back and is in Documents again. Back is gone at Documents.

**Sam is blocked (UJ-2).** Sam clicks Select Folder and denies access. The File List shows "Access Denied" in bold, and the status bar reads "Access denied". Select Folder is still available; Sam picks another folder and the list loads.

## Assumptions and Open Items

- U1: Select Folder button lives in the header.
- U2: Folder name and Back button sit in the File List panel.
- U3: Folder rows open on click or Enter; file rows do nothing.
- U4: Back is hidden at the originally chosen Folder (matches PRD FR-6 and Open Question 1 default).
- U5: Entries are ordered subfolders first, then files, each alphabetical.
- U6: Loading is shown as text only.
- U7: No keyboard shortcuts beyond Tab and Enter.
- U8: A denied folder clears the previous list instead of keeping it on screen.
- U9 (settled in Story 1.1): the unsupported-browser message is the plain text above, shown in the File List panel, with Select Folder disabled.
- D1: Bold marks folders and the Access Denied message.
- D2: Desktop width only.
- D3: A trailing `/` and bold mark folders; no icons.

Open for later phases: browser support and how folder access is requested (architecture).
