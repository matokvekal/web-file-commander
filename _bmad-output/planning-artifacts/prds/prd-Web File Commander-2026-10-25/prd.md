---
title: "PRD: Web File Commander"
status: final
created: 2026-10-25
updated: 2026-10-25
---

# PRD: Web File Commander

## 0. Document Purpose

This PRD defines version 2 of Web File Commander for the product owner and for downstream BMAD workflows (UX, architecture, epics). It builds on the final product brief (`_bmad-output/planning-artifacts/briefs/brief-Web File Commander-2026-10-25/brief.md`) and on `docs/requirements.md`, and does not repeat them. It states capabilities only. Technology options live in the brief's addendum and remain unconfirmed. Approved assumptions are indexed in section 9.

## 1. Vision

Web File Commander is a simple, read-only file browser. A user selects a folder and immediately sees what is in it: its files and subfolders. The app always makes clear what it is doing, whether a folder is still loading or access was denied.

It is a BMAD Level 4 homework project, not a commercial product. Version 2 is the first functional version, built on the existing empty three-panel screen. It aims at one thing: browsing a folder clearly and calmly.

## 2. Target User

### 2.1 Jobs To Be Done

- When I want to see what is in a folder, I want to pick it and see its files and subfolders at once, so I do not need a full-featured file manager.
- When something is slow or blocked, I want the app to tell me, so I am never left guessing whether it is working.

### 2.2 Non-Users (v2)

People who need to change files (edit, delete, move, upload) or manage them in bulk.

### 2.3 Key User Journeys

- **UJ-1. Dana looks inside a folder.** Dana, a general computer user, wants to see what is in her Documents folder. She opens the app and selects the folder. While it loads she sees a loading indicator. It disappears and the Folder's files and subfolders are listed. She opens a subfolder and sees its contents, then goes back to the parent Folder.
- **UJ-2. Sam is blocked and understands why.** Sam, a developer, selects a folder and, when asked for permission, denies access. The app shows an access-denied message and stays usable, so Sam can select a different Folder.

## 3. Glossary

- **Folder** — A location that contains Entries.
- **Entry** — A file or a subfolder inside a Folder.
- **Selected Folder** — The Folder the user most recently chose to browse.
- **Parent Folder** — The Folder that contains the Selected Folder.
- **Folder Selection** — The user action of choosing a Folder to browse.
- **File List** — The panel that displays the Entries of the Selected Folder.
- **Loading Indicator** — A visible signal that the Selected Folder's Entries are still being retrieved.
- **Access-Denied Message** — A visible message telling the user that access to a Folder was refused.
- **Preview Panel** — The existing panel reserved for file preview. In v2 it is a placeholder.
- **Folder Tree Panel** — The existing panel reserved for folder-tree navigation. In v2 it is a placeholder. Tree navigation is not in v2; subfolders are opened from the File List. (A1)

## 4. Features

### 4.1 Folder Selection and Browsing

**Description:** The user chooses a Folder. The app displays its Entries in the File List, clearly distinguishing files from subfolders. The user can open a subfolder from the File List, which makes it the Selected Folder, and can go back to the Parent Folder. Realizes UJ-1.

#### FR-1: Select a Folder

The user can perform Folder Selection to choose any Folder they have access to. Realizes UJ-1.

**Consequences (testable):**
- After Folder Selection, the chosen Folder is the Selected Folder.
- Selecting a different Folder replaces the previous Selected Folder's Entries.

#### FR-2: Display the Entries of the Selected Folder

When a Folder is selected, the File List displays all of its Entries, showing each Entry's name and whether it is a file or a subfolder. Realizes UJ-1.

**Consequences (testable):**
- A Folder with 3 files and 2 subfolders displays all 3 files and 2 subfolders. (Requirements Test 1.)
- No Entry is omitted and no Entry is shown twice.
- A Folder with no Entries shows an empty-folder message. (A2)

#### FR-3: Open a subfolder

The user can open a subfolder shown in the File List, making it the Selected Folder and displaying its Entries. Realizes UJ-1.

**Consequences (testable):**
- After opening a subfolder, the File List shows that subfolder's Entries.
- Opening a subfolder follows the same loading and access-denied behavior as FR-4 and FR-5.

#### FR-6: Go back to the Parent Folder

The user can go back from the Selected Folder to its Parent Folder, which becomes the Selected Folder with its Entries displayed. Realizes UJ-1.

**Consequences (testable):**
- After opening a subfolder and then choosing to go back, the File List shows the Entries of the Folder the subfolder was opened from.
- Going back follows the same loading and access-denied behavior as FR-4 and FR-5.
- When the Selected Folder has no Parent Folder to go back to, going back is not offered or has no effect, and the app does not crash. How far above the originally chosen Folder the user may go is Open Question 1.

**Out of Scope:** history navigation (forward/back through previously visited Folders), breadcrumbs.

### 4.2 Status Feedback

**Description:** The user is never left guessing. The app shows a Loading Indicator while a Folder loads and an Access-Denied Message if access is refused. Realizes UJ-1, UJ-2.

#### FR-4: Show a Loading Indicator while a Folder loads

While the Entries of a Selected Folder are being retrieved, the app displays a Loading Indicator. Realizes UJ-1.

**Consequences (testable):**
- The Loading Indicator is visible while loading is in progress. (Requirements Test 2.)
- The Loading Indicator disappears when loading completes, and the Entries are shown.

#### FR-5: Show an Access-Denied Message when access is refused

If the user denies access to a Folder, the app displays an Access-Denied Message. Realizes UJ-2.

**Consequences (testable):**
- The Access-Denied Message reads "Access Denied". (Requirements Test 3.)
- The app does not crash, and the user can immediately perform Folder Selection again.
- No Entries of the refused Folder are shown.

## 5. Non-Goals (Explicit)

- Editing, deleting, moving, or uploading files.
- Advanced or bulk file management.
- File preview. The Preview Panel remains a placeholder.
- Becoming a replacement for the operating system's file manager.

## 6. MVP Scope

### 6.1 In Scope

- Folder Selection, Entry display, opening subfolders, going back to the Parent Folder (FR-1 to FR-3, FR-6).
- Loading Indicator and Access-Denied Message (FR-4, FR-5).

### 6.2 Out of Scope for MVP

- File preview (deferred; no plan for a later version).
- Folder-tree navigation in the Folder Tree Panel. (A1)
- Sorting, searching, filtering of Entries. (A4)
- Forward/back history and breadcrumbs.

## 7. Success Metrics

**Primary**
- **SM-1**: All three acceptance tests in `docs/requirements.md` (Folder Selection, Folder Loading, Access Denied) pass. Validates FR-1, FR-2, FR-4, FR-5.
- **SM-2**: A user can select a Folder, open a subfolder, and read its Entries without any explanation. Validates FR-1, FR-2, FR-3, FR-6. Judged informally by the product owner, with no formal usability test. (A5)

**Counter-metrics (do not optimize)**
- **SM-C1**: Number of features. Passing the tests must not be achieved by adding editing, deletion, moving, uploading, or preview. Counterbalances SM-1.

## 8. Open Questions

1. How far above the originally chosen Folder may the user go back? Default: only to the Folder originally chosen, since access was granted for that Folder. Decide in architecture; owner: product owner; revisit when the architecture phase starts.
2. How are Entries ordered (for example, subfolders first, then alphabetical)? Default if unanswered: no specific order guaranteed.
3. Which browsers and operating systems must the app support? Deferred to the architecture phase (see the brief's addendum).

## 9. Assumptions Index
*All approved by the product owner on 2026-10-25.*

- A1 (3, 6.2): Folder Tree Panel stays a placeholder; subfolders are opened from the File List.
- A2 (FR-2): An empty-folder message is shown for a Folder with no Entries.
- A3 (FR-6): Changed by the product owner. Basic navigation back to the Parent Folder is in v2, with a testable requirement.
- A4 (6.2): No sorting, searching, or filtering in v2.
- A5 (SM-2): Ease of use is judged informally by the product owner.
