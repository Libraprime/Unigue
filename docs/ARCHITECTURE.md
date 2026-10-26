# Architecture (as built)

> How the app is put together **today**. For why, see `docs/adr/`. For what's
> done and what's next, see `docs/REDESIGN_PLAN.md`. Update this file in the
> same change whenever routes, providers or the data model change.

Stack: Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind
v4 + daisyUI 5 · Firebase (Auth, Firestore) · `react-hot-toast`.

Path alias: `@/*` → `src/*`. Shared code lives in `src/components/` (including
`src/components/lib/`, a historical location; don't create a second `lib`).

## Routes

| URL | File | Rendering | Access |
|---|---|---|---|
| `/` | `app/(shop)/page.tsx` | static | public |
| `/product/[id]` | `app/(shop)/product/[id]/page.tsx` | SSG (`generateStaticParams`) | public |
| `/bag` | `app/(shop)/bag/page.tsx` | static shell, client data | public (guest bag) |
| `/favorites` | `app/(shop)/favorites/page.tsx` | static shell, client data | public (guest favourites) |
| `/checkout`, `/orders`, `/account` | `app/(shop)/<name>/page.tsx` | client-guarded | **signed-in account only** (ADR 0006); bodies are Phase 7 placeholders |
| `/Info/privacy_policy`, `/Info/termsConditions` | `app/(shop)/Info/...` | static | public; **stub content** |
| `/login`, `/signUp`, `/forgot-password` | `app/(auth)/<name>/page.tsx` | dynamic (`returnTo`) | public |
| `/dashboard` | `app/dashboard/page.tsx` | redirect to `/` | legacy |

Layout groups (no effect on URLs):
- `app/layout.tsx` — fonts, theme anti-flash script, `<Toaster>`,
  `FirebaseProvider` → `ShopProvider` → `{children}{modal}`.
- `app/(shop)/layout.tsx` — `Navbar` + `Footer` shell.
- `app/(auth)/` — no shell; each page renders `AuthShell` (split screen).

**Quick-view modal:** parallel route `app/@modal/(.)product/[id]/page.tsx`
intercepts soft navigations to `/product/[id]` (clicking a card). A hard load
or refresh renders the full page. The folder name must equal the route segment
(`product`); `app/@modal/default.tsx` returns `null` when no modal is active.

## Providers (client)

- **`FirebaseProvider`** (`components/FirebaseProvider.tsx`) — `useFirebase()`
  → `{ auth, db, currentUser, loading, ... }`. Never blocks rendering. Creates
  a guest (anonymous) session on every non-auth page when there is no user,
  including after sign-out. `currentUser.isAnonymous` is how "guest" is
  detected.
- **`ShopProvider`** (`components/ShopProvider.tsx`) — `useShop()` →
  `{ loaded, cart, cartCount, favorites, addToBag, setQuantity, removeFromBag,
  toggleFavorite, isFavorite }`. Subscribes to the current user's Firestore
  collections; snapshots are tagged with their UID so a user switch never shows
  the previous user's data. `loaded` is false until the first snapshots land.

## Data model

Products are not in Firestore (ADR 0004). Read them only via
`components/lib/product.ts`: `getProducts()`, `getProduct(id)`,
`getCategories()`, `formatNaira()`. `price` is a number in naira.

Firestore (rules: `firestore.rules`):

| Path | Fields | Who |
|---|---|---|
| `users/{uid}` | `uid, name, email, photoURL, createdAt` | owner |
| `users/{uid}/cart/{productId}` | `productId:int, quantity:int(1..10), updatedAt` | owner |
| `users/{uid}/favorites/{productId}` | `productId:int, addedAt` | owner |
| `newsletter/{autoId}` | `email:string, createdAt` | any signed-in session, **create only** |

Everything else is denied by default. New collections need rules in the same
change.

## Auth flows (`components/lib/auth.ts`)

| Situation | What happens |
|---|---|
| Sign up (email), guest session | `updateProfile` then `linkWithCredential` → same UID, data kept |
| Sign up (email), no session | `createUserWithEmailAndPassword` |
| Sign up with an existing email | error → UI links to login (keeps `returnTo`) |
| Log in (email), guest session | snapshot guest data → sign in → merge into account (ADR 0005) |
| Google, guest session | `linkWithPopup`; if account exists → `signInWithCredential` + merge |
| Google, no session | `signInWithPopup` |
| Any of the above | `users/{uid}` doc is created if missing; then `router.push(returnTo)` |

`returnTo` is always passed through `safeReturnTo()` (`lib/returnTo.ts`).
Guarded pages use `<RequireAuth>`; it redirects guests and signed-out visitors
to `/login?returnTo=...`.

## Components map

- `Navbar`, `mobile_menu`, `Footer`, `Hero`, `Logo`, `ThemeToggle`, `icons`
- `Body/` — `Main_body` (home composition), `BrandStrip`, `NewArrivals`,
  `Features`, `PopularGrid`, `Newsletter`, `Card`
- `ProductActions` (add / favourite / buy now), `Bag`, `Favorites`,
  `ComingSoon` (Phase 7 placeholder), `RequireAuth`
- `auth/` — `AuthShell`, `PasswordInput`; `Oauth` (Google button)
- `lib/` — `firebase`, `auth`, `guest`, `product`, `returnTo`

## Conventions

- Style with daisyUI/Tailwind **theme tokens** (`bg-base-100`, `text-neutral-content`,
  `btn-primary`, ...). No hardcoded `amber-*`/`gray-*`/`white`, and no
  `dark:` utilities for colour: the two themes handle it (ADR 0003).
- Icons: add to `components/icons.tsx`; no external icon CDNs.
- Dark mode is `data-theme` on `<html>`; never read `prefers-color-scheme` in components.
- Components that need auth or bag state are client components using the two
  hooks above. Don't import `lib/firebase` directly in components.
- Currency: `formatNaira()`; never format prices by hand.
- Keep storefront pages server-rendered where possible (SEO is a goal, ADR 0001).
- Commits: Conventional Commits; a phase's `docs:` update lands with the phase.

## Known gaps

See `REDESIGN_PLAN.md` → Phase 7 and Open questions. Notably: no category/search
pages, no sizes/variants, no checkout/payment/orders, stub legal pages,
hotlinked product images.
