---
name: Web File Commander
description: Plain grey, system-font file browser. Documents the existing look from src/App.css and the few visual additions v2 needs.
status: final
updated: 2026-10-25
colors:
  surface: '#FFFFFF'
  surface-bar: '#F5F5F5'
  surface-title: '#EAEAEA'
  border: '#CCCCCC'
  text: '#333333'
  text-muted: '#666666'
typography:
  title:
    fontFamily: 'system-ui, sans-serif'
    fontSize: 1.125rem
  body:
    fontFamily: 'system-ui, sans-serif'
    fontSize: 0.875rem
rounded:
  none: 0px
spacing:
  sm: 0.5rem
  md: 0.75rem
  lg: 1rem
components:
  header:
    background: '{colors.surface-bar}'
    border-bottom: '1px solid {colors.border}'
    padding: '{spacing.md} {spacing.lg}'
  panel-title:
    background: '{colors.surface-title}'
    border-bottom: '1px solid {colors.border}'
    padding: '{spacing.sm} {spacing.lg}'
  panel-body:
    padding: '{spacing.lg}'
    foreground: '{colors.text-muted}'
  status-bar:
    background: '{colors.surface-bar}'
    border-top: '1px solid {colors.border}'
    foreground: '{colors.text}'
  entry-row:
    padding: '{spacing.sm} {spacing.lg}'
    border-bottom: '1px solid {colors.border}'
  button:
    background: '{colors.surface-title}'
    border: '1px solid {colors.border}'
    foreground: '{colors.text}'
---

## Brand & Style

Keep the existing simple grey style. Flat, no shadows, no accent color, system font. Values above are read from `src/App.css`. Nothing here restyles what already exists.

## Colors

Greys only. `{colors.surface-bar}` for header and status bar, `{colors.surface-title}` for panel titles, `{colors.border}` for all dividers. Body text is `{colors.text-muted}` in panels and `{colors.text}` in the status bar. No color carries meaning on its own; states are told apart by text (see EXPERIENCE.md).

## Typography

System font. Application title at `{typography.title.fontSize}`, everything else at `{typography.body.fontSize}`. Use bold for folder names and for the Access Denied message. [ASSUMPTION D1: bold is enough to set these apart; no new font sizes.]

## Layout & Spacing

Keep the current layout: header on top, three equal-width panels in a row (Folder Tree, File List, Preview), status bar at the bottom. Spacing uses `{spacing.sm}`, `{spacing.md}`, `{spacing.lg}`. [ASSUMPTION D2: desktop width only; no small-screen layout in v2.]

## Elevation & Depth

None. Panels are separated by 1px `{colors.border}` lines.

## Shapes

Square corners (`{rounded.none}`), as now.

## Components

Existing: `header`, `panel-title`, `panel-body`, `status-bar`. New in v2, built from the same tokens:

- **entry-row** — one line per Entry in the File List. Folder rows are bold with a trailing `/`; file rows are regular. Hover and keyboard focus show `{colors.surface-title}` as background. [ASSUMPTION D3: the trailing `/` plus bold is the folder marker; no icons.]
- **button** — used for Select Folder and Back. Grey fill, 1px border, square corners, visible focus outline.
- **message** — Loading, Access Denied and empty-folder text, placed in `panel-body` of the File List. Same text style as `panel-body`; Access Denied is bold.

## Do's and Don'ts

- Do reuse the existing grey tokens.
- Don't add colors, shadows, icons, or new fonts in v2.
- Don't rely on color alone to show a state.
