# Unigue Stores

Footwear storefront built with Next.js 16, React 19, Tailwind v4 + daisyUI 5
and Firebase (Auth + Firestore). Prices are in naira.

Browsing, quick view, bag and favourites work without an account (guest
session); checkout, orders and account require signing in.

## Start here

| If you want to... | Read |
|---|---|
| Run it / configure Firebase | [`docs/SETUP.md`](docs/SETUP.md) |
| Understand how it's built | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| See what's done and what's next | [`docs/REDESIGN_PLAN.md`](docs/REDESIGN_PLAN.md) |
| Know why a decision was made | [`docs/adr/`](docs/adr) |
| See the design reference | `docs/screens/` (web + app screens) |

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in your Firebase config (see docs/SETUP.md)
npm run dev
```

Then complete the Firebase console checklist in `docs/SETUP.md` (anonymous
sign-in and `firestore.rules` are required).

## Scripts

`npm run dev` · `npm run build` · `npm run start` · `npm run lint` · `npx tsc --noEmit`

## Working on this repo

- The plan's status table is the source of truth; update it in the same change
  as the work. A changed decision gets a new ADR, not an edit to an old one.
- Conventional Commits. Run `npm run lint`, `npx tsc --noEmit` and
  `npm run build` before handing off.
