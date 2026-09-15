# ADR 0003: Design tokens via daisyUI custom themes, single dark-mode mechanism

## Status
Accepted

## Date
2026-09-09

## Context
While wiring up light/dark theming (Phase 1 of `REDESIGN_PLAN.md`), we found
`tailwind.config.ts` was dead code: this project runs Tailwind v4, which is
CSS-first (`@theme` in `globals.css`), and nothing referenced the JS config
via an `@config` directive. In practice this meant three things silently
didn't work: `bg-gray-light` (used in `Card.tsx`) resolved to no color,
`font-serif` fell back to the browser default instead of the intended font,
and `scrollbar-hide` (used in `Main_body.tsx`) didn't hide anything because
its plugin was never loaded.

Separately, `data-theme="luxury"` was hardcoded on `sidebar.tsx` and the root
`page.tsx`, overriding whatever theme a user had selected for that part of
the page — incompatible with a global, user-controlled light/dark toggle.

## Decision
- Define two custom daisyUI v5 themes, `uniguelight` and `uniguedark`, using
  the charcoal-accent palette from the Figma reference, via
  `@plugin "daisyui/theme"` blocks in `globals.css`. Drop the `luxury` theme
  and its hardcoded usages.
- Bind Tailwind's `dark:` variant to `[data-theme="uniguedark"]` via
  `@custom-variant dark (...)`, so the several pre-existing `dark:` utilities
  in the codebase (`Card.tsx`, `Main_body.tsx`, the quick-view modal) start
  working and follow the toggle rather than only the OS preference.
- Delete `tailwind.config.ts`. Replace the one utility it provided that was
  actually load-bearing (`scrollbar-hide`) with a native Tailwind v4
  `@utility` block instead of re-wiring the third-party plugin.
- Drop `font-serif` from scope for now — it was tied to a font (Merriweather)
  that was never loaded via `next/font` in the first place, and doesn't match
  the sans-forward direction of the Figma reference. Revisit in Phase 6 if
  the auth-page redesign wants a serif accent deliberately.

## Alternatives considered
- **Keep `tailwind.config.ts` and wire it up properly via `@config`.**
  Rejected — Tailwind v4's CSS-first config is the supported path going
  forward, and the JS config's actual content (an unused color palette, two
  unused spacing keys, one unused border-radius key, and one plugin) wasn't
  worth preserving as-is.
- **Keep the `luxury` theme as a third option.** Rejected — a three-theme
  system with one theme applied unevenly (only two components) fragments the
  design language we're trying to unify in Phase 5.

## Consequences
- **Easier:** one real set of design tokens, consumed consistently; the
  `dark:` variant now means one specific, predictable thing everywhere it's
  used in the codebase.
- **Harder:** the two `bg-amber-200 dark:bg-base-100` usages (newsletter
  section, product card image) were tuned against theme-less defaults and
  will likely need a visual pass in Phase 5 now that dark mode actually
  activates on them.
- Fixed incidentally: `bg-gray-light` → `bg-base-200` (Card.tsx), scrollbar
  hiding on the horizontal product rail (Main_body.tsx) now actually works.

## Related
- `REDESIGN_PLAN.md`, Phase 1
- `src/app/globals.css`, `src/components/ThemeToggle.tsx`
