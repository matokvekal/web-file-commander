---
title: "Product Brief: Web File Commander"
status: final
created: 2026-10-25
updated: 2026-10-25
---

# Product Brief: Web File Commander

## Executive Summary

Web File Commander is a simple file-browsing application. A user selects a folder and sees its files and subfolders in a clear three-panel screen. The app also tells the user what is happening while a folder loads and when access to it is denied.

This is a BMAD Level 4 homework project, not a commercial product. Its purpose is to practice a structured product-development workflow while building a small, working application, and this brief is sized for that purpose.

Today the project is a static screen layout with no working features. Version 2 is the first functional version: basic folder selection and browsing.

## The Problem

People who want to look at what is in a folder use their operating system's file manager. It works, but it is a general-purpose tool with many features, and not always the clearest way to simply browse. This project explores a deliberately simple alternative focused on browsing, with clear feedback when something is loading or blocked.

No user research has been done. The problem statement reflects the project's stated goal, not a measured pain.

## The Solution

A read-only file browser. The user selects a folder and sees its files and subfolders. While the folder loads, the app shows a loading indicator. If the user denies access to the folder, the app shows a clear access-denied message and keeps working.

## What Makes This Different

Nothing, commercially. The value is focus: browsing only, with plain feedback about loading and access problems. The real purpose is practicing the BMAD workflow. No competitive analysis is needed for that purpose.

## Who This Serves

- **General computer users** who need a simple, clear way to browse files and use their OS file manager today.
- **Developers**, who browse project and system folders often and may prefer a focused view.

Success for both: they pick a folder, see what is in it, and always understand what the app is doing.

## Success Criteria

- Selecting a folder containing 3 files and 2 subfolders displays all 3 files and 2 subfolders.
- A loading indicator is visible while a folder is loading and disappears when loading completes.
- If the user denies access to a folder, the app shows an "Access Denied" message and does not crash.

These match the three tests in `docs/requirements.md`.

## Scope

**In (v2):**
- Folder selection.
- Display of the selected folder's files and subfolders.
- Opening a subfolder to browse into it.
- Loading indicator while a folder loads.
- Access-denied message.

**Out (v2):**
- File editing, deletion, moving, and uploading.
- Advanced file management of any kind.
- File preview. The Preview panel remains an empty placeholder.

**Constraint:** delivered as a web application; read-only, it never changes the user's files.

## Vision

No roadmap beyond v2. This is a learning exercise, and any later direction would be decided through the BMAD process.
