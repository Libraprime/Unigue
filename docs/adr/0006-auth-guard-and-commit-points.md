# ADR 0006: One client-side auth guard; which actions are "commitment points"

## Status
Accepted

## Date
2026-10-20

## Context
ADR 0001 says authentication is required only at commitment points, and the
plan listed "Add to Bag → Checkout, Order History, Account Settings". "Add to
Bag" appears in that list but guests are explicitly allowed to build a bag
(ADR 0002), so the boundary needed to be stated precisely. Guards written
page-by-page also drift, and a naive `returnTo` redirect is an open-redirect
vulnerability.

## Decision
1. **Open to guests:** browsing, quick view, favourites, newsletter, and
   **adding to and editing the bag**.
2. **Requires a real (non-anonymous) account:** `/checkout`, `/orders`,
   `/account`, and anything added after them in Phase 7.
3. Every guarded page is wrapped in the single `<RequireAuth>` component
   (`src/components/RequireAuth.tsx`). It treats anonymous sessions as signed
   out and redirects to `/login?returnTo=<path>`.
4. After login or sign-up (email or Google) the person is sent back to
   `returnTo`. The sign-up/login links carry it across.
5. `returnTo` is validated by `safeReturnTo()` (`lib/returnTo.ts`): same-site
   absolute paths only; `//host`, backslashes, full URLs and the auth pages
   themselves fall back to `/`.
6. The guard is UX only. Firebase auth is client-side, so **real enforcement
   is `firestore.rules`**. New private data needs a rule in the same change.

## Alternatives considered
- **Login modal that resumes the action.** Rejected for now: needs the auth
  forms to work in an overlay and per-action resume logic; a redirect with
  `returnTo` is simpler and resumes at page level.
- **Next.js `middleware`/`proxy` guard.** Rejected: the session lives in the
  browser (Firebase client SDK), so the server can't see it without adding
  session cookies and the Admin SDK.
- **Guard "Add to bag".** Rejected: it contradicts ADR 0002 and adds friction
  before intent is even confirmed.

## Consequences
- **Easier:** Adding a guarded page is one wrapper; the policy is in one place.
- **Harder:** Guarded pages render a spinner, then redirect, on the client
  (no server-side 302). Page content must never be rendered before the guard
  passes; keep sensitive data fetching inside the wrapped children.

## Related
- ADR 0001, ADR 0002, ADR 0005
- `REDESIGN_PLAN.md`, Phase 3
