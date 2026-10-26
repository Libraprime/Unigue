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
2026-10-20 (Phases 1–6 landed; Phase 7 not started)

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
| 2 | Restructure routing: public storefront | Done | Storefront is `/` under the `(shop)` route group; splash gate removed; `/dashboard` redirects to `/`. |
| 3 | Guard the commitment points | Done | `<RequireAuth>` + validated `returnTo` on `/checkout`, `/orders`, `/account`. See ADR 0006. Page bodies are Phase 7 placeholders. |
| 4 | Guest session + account merge | Done | Bag/favourites in Firestore per UID; sign-up links the guest, login merges. See ADRs 0004, 0005. Needs console setup: `docs/SETUP.md`. |
| 5 | Visual redesign of core components | Done | Navbar, Hero, Card, Footer, home sections rebuilt on tokens. `Gcard` removed (unused). |
| 6 | Finish auth pages + quick-view modal | Done | Split-screen login/signUp/forgot-password; modal route renamed `(.)product` so it actually intercepts. |
| 7 | Commerce flows (post-redesign) | Not started | Category/search pages, filters, product detail extras, bag + checkout design, payment, orders, account settings. See below. |

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
- Later touch-up (Phases 2–6 change): `ThemeToggle` now observes the
  `data-theme` attribute with `useSyncExternalStore` instead of copying it into
  state inside an effect. Behaviour is unchanged; it satisfies the
  `react-hooks/set-state-in-effect` lint rule, which could not run before the
  ESLint config was repaired (below).
- **Depends on:** nothing. **Blocks:** Phase 5 (redesign consumes these
  tokens, not be redone after).

### 2. Restructure routing: public storefront — Done
- Storefront pages live in the `src/app/(shop)/` route group, whose layout
  renders `Navbar` + `Footer`. The group does not change URLs: `/`,
  `/product/[id]`, `/bag`, `/favorites`, `/checkout`, `/orders`, `/account`,
  `/Info/*`. The `(auth)` group keeps its own split-screen layout.
- Splash gate removed. `/dashboard` is kept as a redirect to `/` for old
  bookmarks (resolves the earlier open question).
- `FirebaseProvider` no longer blocks rendering behind a full-page "Loading...":
  that made every page's server HTML an empty spinner and broke ADR 0001's
  SEO goal. Auth-dependent UI reads `loading` from context instead.
- `/product/[id]` is a server component with `generateStaticParams` and
  per-product metadata.
- **Depends on:** nothing. **Blocks:** Phases 3–4.

### 3. Guard the commitment points — Done
- Guarded: `/checkout`, `/orders`, `/account` (wrapped in `<RequireAuth>`).
  Adding to the bag is intentionally open to guests (ADR 0006).
- Unauthenticated (or guest) → `/login?returnTo=<path>`; after login or
  sign-up the person returns there. `returnTo` is validated (`safeReturnTo`).
- The three guarded pages render a `ComingSoon` body until Phase 7. The guard
  is final; only the body is replaced.
- **Depends on:** Phase 2.

### 4. Guest session + account merge — Done
- `FirebaseProvider` creates a guest session on non-auth pages and now
  re-creates one after sign-out. Fixed a path bug: the exclusion list had
  `/signup` but the route is `/signUp`, so guests were created on the register
  page too.
- Sign-up (email/Google) **links** the guest (same UID). Login to an existing
  account **merges** guest bag/favourites into it (ADR 0005, which clarifies
  ADR 0002). All in `lib/auth.ts` + `lib/guest.ts`.
- Data layer: `ShopProvider`/`useShop()` over `users/{uid}/cart` and
  `users/{uid}/favorites`; products behind `lib/product.ts` (ADR 0004). A
  minimal `/bag` and `/favorites` page make it usable.
- Email sign-up now also creates the `users/{uid}` profile doc (previously only
  Google sign-in did).
- **Requires** Anonymous sign-in enabled and `firestore.rules` deployed
  (`docs/SETUP.md`).
- **Depends on:** Phase 2.

### 5. Visual redesign of core components — Done
- Rebuilt `Navbar`, `Hero`, `Card`/`Gcard`, `Footer` using Phase 1 tokens and
  the Figma reference layout (bold headline treatment, clean grid product
  cards, chip filters, dark footer).
- Placeholders replaced: real hero copy, no `video src="null"`, inline SVG
  icons instead of Flaticon GIFs, the undefined `animate-marquee` now has real
  keyframes, the malformed `snap-x mandatory` fixed, and the Phase 1 follow-up
  (`bg-amber-200 dark:...`) removed in favour of tokens.
- Home sections: brand strip, New arrivals carousel (products with
  `isNew`), features row, "Popular for you" grid with category chips (URL
  param `?category=`) and price sort, newsletter (writes to `newsletter`).
- Navbar links are real: Shop + one link per catalog category. The reference's
  Men/Women/Kids/Brands and the search icon are NOT included because the
  catalog has no gender/brand data and there are no category/search pages yet
  (Phase 7).
- `Gcard` deleted (no imports; superseded by `Card`).
- **Depends on:** Phase 1 (tokens), Phase 2 (final page structure).

### 6. Finish auth pages + quick-view modal — Done
- Redesigned `login` / `signUp` / `forgot-password` as split-screen layout (dark
  brand panel + form), matching the Figma reference.
- Shared `AuthShell`, `PasswordInput` and a typed `Oauth` replace ~250 lines of
  duplicated markup. The old rotating `Sidebar` is gone. The nested second
  `FirebaseProvider` in the auth layout was removed.
- Quick-view modal: the intercepting folder was `(.)products` while the route
  is `/product/[id]`, so it never intercepted. Renamed to `(.)product`; it now
  uses theme tokens, closes on Esc/backdrop, locks scroll, and has real
  Add to bag / favourite / Buy now actions. A hard load shows the full page.
- **Depends on:** Phase 1, Phase 2.

### 7. Commerce flows (post-redesign) — Not started
Everything the reference screens in `docs/screens` show beyond browse + auth.
Suggested order; each item that makes a real decision gets an ADR:
- Category pages and search + search results; full filter set (price, colour,
  size, gender, brand, type) — needs richer catalog data first. Men / Women /
  Kids / Brands navigation depends on this.
- Product detail extras: size selection + size guide, image gallery, reviews,
  "Added to Bag" popup. Cart lines will need a size/variant dimension.
- Bag and checkout redesigned to the screens: information, delivery, payment,
  billing. Totals must be recomputed server-side (ADR 0004).
- Payment provider integration (Paystack or Flutterwave suggested for
  Nigeria) behind a single interface.
- Orders (ongoing/history) and order Firestore rules; account settings and edit
  account. Replace the `ComingSoon` bodies on `/checkout`, `/orders`,
  `/account` (guards are already in place).
- Move the catalog to Firestore/CMS if it grows (change `lib/product.ts` only).
- Replace stub legal pages (`/Info/*`) with real content; real newsletter
  delivery; real social links in the footer.
- **Depends on:** Phases 1–6.

## Housekeeping done alongside Phases 2–6

- `eslint.config.mjs` rewritten for Next 16's flat config (`FlatCompat` crashed
  with a circular-JSON error) and `npm run lint` now runs `eslint .`
  (`next lint` no longer exists in Next 16). Lint, `tsc` and `next build` all pass.
- `firebase-debug.log` and `.firebase/` are gitignored; `.env.example` added.
- `firebase.json` added (points at `firestore.rules`) so rules can be deployed.
- Removed debug `console.log`s that printed the full auth user object.

## Decision log

Significant decisions get a full ADR in `docs/adr/`. Quick index:

- [ADR 0001](./adr/0001-public-storefront-browsing.md) — Public storefront browsing, auth only at commitment points
- [ADR 0002](./adr/0002-guest-account-merge.md) — Guest sessions via anonymous auth + account linking
- [ADR 0003](./adr/0003-design-tokens-and-theme-system.md) — Design tokens via daisyUI custom themes, single dark-mode mechanism
- [ADR 0004](./adr/0004-catalog-and-user-data-layer.md) — Static catalog behind a repository; bag and favourites in Firestore
- [ADR 0005](./adr/0005-login-merges-guest-data.md) — Logging in merges guest data instead of linking (clarifies ADR 0002)
- [ADR 0006](./adr/0006-auth-guard-and-commit-points.md) — One client-side auth guard; which actions are commitment points

## Where to read next

- `docs/ARCHITECTURE.md` — how the app is put together today (routes,
  providers, data model, conventions).
- `docs/SETUP.md` — environment, Firebase console settings, rules, scripts.

## Open questions

- Which payment provider for Phase 7 (Paystack vs Flutterwave)?
- Should the catalog move to Firestore before Phase 7 filters (colour, size,
  brand, gender need data the static array doesn't have)?
- Product images are hotlinked from Unsplash; host them (Firebase Storage is
  already allow-listed in `next.config.ts`) before launch.
