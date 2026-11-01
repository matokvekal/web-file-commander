# Web File Commander

A small, read-only file browser that runs in the browser. Pick a folder, see its files and subfolders, open subfolders and go back. It shows a loading message while a folder is read and an "Access Denied" message when access is refused. This is a BMAD Level 4 homework project.

## Requirements

- Node.js 22.6 or newer and npm (the MCP server in `src/mcp/` runs with `--experimental-strip-types`).
- For the Claude Code extras: PowerShell (`pwsh` or Windows PowerShell) for the `pre-commit-check` skill script.
- Chrome or Edge (version 86 or later) to use the app. It uses the browser folder picker, which Firefox and Safari do not support; there the app shows a message and disables Select Folder.
- Open the app on `http://localhost` or over HTTPS. The folder picker does not work on a plain `http://` network address.

## Setup

```sh
npm install
```

## Run

```sh
npm run dev
```

Open the printed `http://localhost:<port>` address in Chrome or Edge, then click **Select Folder**.

To build and serve the production version:

```sh
npm run build
npm run preview
```

## Test

```sh
npm run test
```

Runs the Vitest suite once. The tests use a fake folder source, so they do not need a browser folder picker.

```sh
npm run lint
```

Runs ESLint.

```sh
npm run check
```

Runs lint, tests and the production build (which includes the TypeScript check).

## Manual browser checks

The automated tests cannot cover the real folder picker. Checklists for Chrome/Edge are in `docs/manual-verification-story-1-1.md`, `-1-2.md` and `-1-3.md`. Stories 1.2 and 1.3 are marked `review` until these are done.

## Project layout

- `src/access/` is the only code that touches the browser folder API (a `FolderAccess` port with a browser adapter and a fake adapter).
- `src/state/useFolderBrowser.ts` holds the folder state.
- `src/App.tsx` and `src/App.css` are the screen.

## Documentation

- Exercise write-ups: `docs/exercise-02-brief.md`, `docs/exercise-03-bmad-install.md`, `docs/exercise-04-project-context.md`, then `docs/exercise-05-*.md` to `docs/exercise-11-lessons.md`.
- BMAD planning artifacts (brief, PRD, UX, architecture, epics): `_bmad-output/planning-artifacts/`.
- Sprint status and the Epic 1 retrospective: `_bmad-output/implementation-artifacts/`.
- Read-only MCP server (Level 5 Exercise 1): `docs/exercise-12-mcp-server.md`.
- Project rules for AI coding agents: `AGENTS.md` (imported by `CLAUDE.md`).
