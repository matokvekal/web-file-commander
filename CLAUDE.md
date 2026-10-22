# Web File Commander — CLAUDE.md

Project conventions and instructions for AI coding agents working on this repository.

## Project status

Minimal starter for BMAD Level 4 homework. File-manager features do not exist yet and must be designed and implemented later through BMAD.

## Tech stack

- React 19 + TypeScript + Vite
- Vitest + jsdom + @testing-library/react for tests
- Plain CSS
- ESLint with typescript-eslint
- No backend

## Available commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`tsc`) and production build (`vite build`)
- `npm run lint` — ESLint
- `npm run test` — Vitest (`vitest run`)
- `npm run check` — lint + test + build (CI-style validation)

## Constraints (do not violate)

- Do NOT implement folder selection, folder trees, file lists, file previews, loading indicators, or file access.
- Do NOT install BMAD.
- Do NOT create PRD, architecture documents, epics, or stories.
- Do NOT implement EARS requirements.
- Do NOT add unnecessary dependencies or features.
- Do NOT push to any remote repository.
- Keep the project minimal and ready for future BMAD development.

## Code style

- TypeScript strict via tsconfig (`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, etc.).
- Plain CSS files co-located with components (e.g. `src/App.css`).
- Components export a default function component.
- Tests live next to the code they test (`*.test.tsx`) and run with Vitest + jsdom.
- No comments in code unless explicitly requested.

## AI agent workflow

1. Before making changes, read the existing files to match conventions.
2. After making changes, run `npm run check` and fix any failures.
3. Keep diffs minimal; do not add unrelated features.
4. Never commit or push unless explicitly asked.
