# Unigue Redesign — Plan & Status

> **Purpose of this document:** This is the single source of truth for the ongoing
> redesign of Unigue. Anyone joining this project — human or AI — should be able to
> read this file and understand what's changing, why, and how far along we are.
>
> **How to keep it useful:** Update the status table whenever a phase's status
> changes. Don't rewrite history — if a decision changes, add a new ADR that
> supersedes the old one (see `docs/adr/`) rather than editing this file to hide
> the earlier reasoning.

## Last updated
2026-09-09 (Phase 1 landed)

## Context

The app (working name "Unigue Stores") is a Next.js 16 / React 19 / Tailwind v4
storefront using Firebase for auth and data. The original build forced every
visitor through a login gate before seeing any products. We're reworking both
the visual design (inspired by a Figma export, internally referred to as the
"Jerskits" reference: bold minimal typography, charcoal accent, clean product
grids, split-screen auth) and the underlying browsing/auth logic.

## Guiding principles

1. **Browse first, authenticate at commitment.** Anyone can view products,
   search, and filter without an account. Login is required only at genuine
   commitment points: placing an order, viewing order history, account
   settings.
2. **No guest data loss.** Actions taken anonymously (favorites, cart) should
   survive the transition to a real account via Firebase's anonymous-account
   linking, not be discarded on signup.
3. **One set of design tokens, everywhere.** Colors, spacing, and type scale
   are defined once and consumed by every component — no more page-by-page
   ad-hoc daisyUI classes.
4. **Docs travel with the code.** Every phase below gets a `docs:` commit
   updating this file's status when it lands.

## Phase status

| # | Phase | Status | Notes |
|---|-------|--------|-------|
| 1 | Design tokens + theme system (light/dark) | Done | Two daisyUI themes (`uniguelight`/`uniguedark`) + toggle in Navbar. See ADR 0003. |
| 2 | Restructure routing: public storefront | Not started | Promote current `/dashboard` content to `/`; retire splash gate |
| 3 | Guard the commitment points | Not started | Add to Bag, Checkout, Order History, Account Settings require auth |
| 4 | Guest session + account merge | Not started | Use existing anonymous auth in `FirebaseProvider`; `linkWithCredential` on signup |
| 5 | Visual redesign of core components | Not started | Navbar, Hero, Card/Gcard, Footer — consumes Phase 1 tokens |
| 6 | Finish auth pages + quick-view modal | Not started | Split-screen login/signup/forgot-password; finish `@modal/(.)products/[id]` |

Status values: `Not started` → `In progress` → `Blocked` (with reason) → `Done`.

## Phase details

### 1. Design tokens + theme system — Done
- Two daisyUI v5 custom themes defined in `globals.css`: `uniguelight`
  (default) and `uniguedark` (`--prefersdark`), using the charcoal-accent
  palette from the Figma reference.
- `ThemeToggle.tsx` flips `data-theme` on `<html>` and persists to
  `localStorage` (`unigue-theme`); an inline script in `layout.tsx` sets the
  theme before first paint to avoid a flash of the wrong theme. Toggle is
  wired into `Navbar.tsx` (desktop + mobile).
- Along the way: removed the dead `tailwind.config.ts` (Tailwind v4 doesn't
  read it), fixed `bg-gray-light` → `bg-base-200` in `Card.tsx`, replaced the
  non-functional `tailwind-scrollbar-hide` plugin with a native `@utility`,
  and removed hardcoded `data-theme="luxury"` from `sidebar.tsx` and root
  `page.tsx`. Full reasoning in ADR 0003.
- **Known follow-up for Phase 5:** `bg-amber-200 dark:bg-base-100` in the
  newsletter section (`Main_body.tsx`) and product card image now actually
  switches on dark mode for the first time — worth a visual check once
  Phase 5 restyles those sections.
- **Depends on:** nothing. **Blocks:** Phase 5 (redesign consumes these
  tokens, not be redone after).

### 2. Restructure routing: public storefront
- Move `Navbar` + `Hero` + `Main_body` + `Footer` (currently only rendered at
  `/dashboard`) to be the public root `/`.
- Remove the splash-screen "Proceed to login" gate at the current `/`.
- **Depends on:** nothing (can run parallel to Phase 1). **Blocks:** Phases 3–4.

### 3. Guard the commitment points
- Add auth checks only on: Add to Bag → Checkout, Order History, Account
  Settings.
- Unauthenticated attempt → redirect to `/login?returnTo=<path>` or open a
  login modal, resuming the action after sign-in.
- **Depends on:** Phase 2.

### 4. Guest session + account merge
- `FirebaseProvider` already calls `signInAnonymously` on non-auth pages —
  reuse this for guest favorites/cart instead of building a new mechanism.
- On login/signup, call `linkWithCredential` to upgrade the anonymous session
  instead of discarding it, so guest activity carries into the real account.
- **Depends on:** Phase 2.

### 5. Visual redesign of core components
- Rebuild `Navbar`, `Hero`, `Card`/`Gcard`, `Footer` using Phase 1 tokens and
  the Figma reference layout (bold headline treatment, clean grid product
  cards, minimal chip filters, dark footer).
- Replace remaining placeholders: Lorem ipsum copy, broken `video src="null"`,
  generic stock icons.
- **Depends on:** Phase 1 (tokens), Phase 2 (final page structure).

### 6. Finish auth pages + quick-view modal
- Redesign `login` / `signUp` / `forgot-password` as split-screen layout (dark
  brand panel + form), matching the Figma reference.
- Finish the already-scaffolded `@modal/(.)products/[id]` intercepting route
  so product clicks open a quick-view overlay instead of a full navigation.
- **Depends on:** Phase 1, Phase 2.

## Decision log

Significant decisions get a full ADR in `docs/adr/`. Quick index:

- [ADR 0001](./adr/0001-public-storefront-browsing.md) — Public storefront browsing, auth only at commitment points
- [ADR 0002](./adr/0002-guest-account-merge.md) — Guest sessions via anonymous auth + account linking
- [ADR 0003](./adr/0003-design-tokens-and-theme-system.md) — Design tokens via daisyUI custom themes, single dark-mode mechanism

## Open questions

- Should `/dashboard` remain as a route (e.g. redirecting to `/`), or be
  removed outright once Phase 2 lands? Leaving a placeholder note here until
  decided.