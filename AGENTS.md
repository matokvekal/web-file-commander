<!-- bmad:context -->
<!-- Verified 2026-10-25 against ea297af. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## Web File Commander

BMAD Level 4 homework project. React 19 + TypeScript + Vite, Vitest + jsdom + Testing Library, plain CSS, ESLint (typescript-eslint), no backend. The app is currently only a static layout: header, empty Folder Tree / File List / Preview panels, status bar. BMAD v6.12.4 is installed (`_bmad/`, skills in `.claude/skills/`); other docs live in `docs/`.

## Policy

- Plan and build new features through the BMAD planning and approval process; planning artifacts go in `_bmad-output/planning-artifacts`, implementation artifacts in `_bmad-output/implementation-artifacts`.
- Do not add unnecessary dependencies or features; keep diffs minimal.
- Never commit or push unless explicitly asked; never push to any remote.
- Never edit `_bmad/config.toml`, `_bmad/config.user.toml`, or `.claude/skills/*/customize.toml` — the installer overwrites them. Put overrides in `_bmad/custom/`.

## Where things are

- Entry: `src/main.tsx` mounts `App` into `#app`; layout in `src/App.tsx` and `src/App.css`.
- Requirements draft and exercise notes: `docs/` (`docs/requirements.md` is a draft).

## Running and verifying

Available commands (verified against `package.json`):

- `npm run dev` — start the Vite dev server (`vite`)
- `npm run build` — type-check and production build (`tsc && vite build`)
- `npm run lint` — ESLint (`eslint .`)
- `npm run test` — Vitest, single run (`vitest run`)
- `npm run check` — lint + test + build (CI-style validation)
- `npm run preview` — serve the production build (`vite preview`)

After changes run `npm run check` and fix failures.

- `tsc` runs only inside `npm run build` and only covers `src/`; there is no separate typecheck script.
- Vitest collects only `src/**/*.{test,spec}.*`; a test outside `src/` never runs.

## Conventions that differ from defaults

- `tsconfig.json` does not enable `strict`; it sets `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `erasableSyntaxOnly`. Remove unused locals/params; use `import type` for type-only imports.
- Components export a default function component; plain CSS co-located (`src/App.css`).
- Tests sit next to the code as `*.test.tsx`.
- No comments in code unless explicitly requested.
- Read existing files to match conventions before changing them.

<!-- /bmad:context -->
