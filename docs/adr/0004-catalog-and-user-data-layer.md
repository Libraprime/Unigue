# ADR 0004: Static product catalog behind a repository; bag and favourites in Firestore

## Status
Accepted

## Date
2026-10-20

## Context
Before this change products were a hardcoded array imported directly by several
components, prices were display strings (`"15,000"`), and the Add to Bag /
Favourite buttons only showed toasts. `mobile_menu.tsx` listened to a
`users/{uid}/cart` collection that nothing ever wrote to. A functioning
storefront needs numeric prices, a single place to read products from, and
per-user (including guest) bag and favourites that persist.

Products are static today (six items, images hosted on Unsplash). Bag and
favourites are per-user data and must survive reloads, devices and the
guest-to-account transition (ADR 0002).

## Decision
1. **Products stay in code** (`src/components/lib/product.ts`) with numeric
   `price` in naira, and are read ONLY through `getProducts()`, `getProduct(id)`
   and `getCategories()`. Nothing else imports the array.
2. **Bag and favourites live in Firestore** under the user's UID (guest or
   real), one document per product:
   - `users/{uid}/cart/{productId}` → `{ productId, quantity, updatedAt }`
   - `users/{uid}/favorites/{productId}` → `{ productId, addedAt }`
3. A single client provider, `ShopProvider`, owns the listeners and exposes
   `useShop()` (bag, favourites, add/remove/toggle). Components never touch
   these collections directly.
4. Quantity per product is capped at 10 (`MAX_QTY`), enforced in the client and
   in `firestore.rules`.
5. Access is restricted to the owner by `firestore.rules`.

## Alternatives considered
- **Products in a Firestore `products` collection with a seed script.**
  Rejected for this phase: it can't be verified without the production
  Firebase project, adds a network dependency to every storefront page, and
  gives nothing while the catalog is six static items. The repository functions
  make this a one-file change later.
- **`localStorage` for guest bag/favourites.** Already rejected in ADR 0002.
- **Store size/options per cart line.** Deferred: the catalog has no size data
  yet (Phase 7).

## Consequences
- **Easier:** Swapping the catalog source (Firestore, CMS, API) touches one
  file. Bag and favourites update live across tabs and devices, and the
  optimistic UI comes free from Firestore's local cache.
- **Harder:** Cart lines reference products by id only; if a product is
  removed from the catalog, stale lines are ignored by the client (not deleted).
  Prices are read from the catalog at render time, so there is no price
  snapshot per line. **Phase 7 (checkout/orders) must snapshot prices into the
  order and recompute totals server-side**; the client bag total is display-only.
- **Depends on:** Anonymous sign-in being enabled in the Firebase console, and
  `firestore.rules` being deployed (see `docs/SETUP.md`).

## Related
- `docs/ARCHITECTURE.md` (data model), `firestore.rules`
- ADR 0002 (guest sessions), ADR 0005 (merge on login)
- `REDESIGN_PLAN.md`, Phase 4 (data layer)
