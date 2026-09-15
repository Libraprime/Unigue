# ADR 0002: Guest sessions via anonymous auth + account linking

## Status
Accepted

## Date
2026-09-09

## Context
Once browsing is public (ADR 0001), guests will still want to favorite items
or build a cart before they're ready to create an account. If that activity
is thrown away the moment they do sign up, we've just moved the friction
from "before browsing" to "after showing intent" — arguably worse, since
now they've done work that gets discarded.

`FirebaseProvider` already calls `signInAnonymously` for visitors on
non-auth pages (this predates the redesign — it was already in the
codebase). Firebase Auth supports upgrading an anonymous session to a real
account via `linkWithCredential`, which preserves the anonymous user's UID
and any data associated with it.

## Decision
Guest favorites/cart are stored against the existing anonymous Firebase
session. On signup or login, call `linkWithCredential` to attach the
real credential to that same UID rather than creating a fresh account and
discarding the anonymous one. Guest activity survives the transition.

## Alternatives considered
- **`localStorage`-only guest cart, merged manually server-side on login.**
  Rejected for now — more custom merge logic to write and test, when
  Firebase's built-in linking does this natively and we're already paying
  for anonymous auth.
- **No guest persistence; require signup before any cart/favorite action.**
  Rejected — reintroduces the friction ADR 0001 is trying to remove, just
  moved one step later in the funnel.

## Consequences
- **Easier:** No custom data-merge code to write or maintain; favorites/cart
  "just work" across the anonymous→real transition.
- **Harder:** `linkWithCredential` fails if the email is already associated
  with an existing account (e.g. a returning user on a new device) — this
  edge case needs explicit handling (fall back to a normal sign-in and
  optionally offer to merge carts, rather than a silent failure).
- **Depends on:** ADR 0001 (there's no guest activity to preserve if
  browsing isn't public in the first place).

## Related
- `REDESIGN_PLAN.md`, Phase 4
- `src/components/FirebaseProvider.tsx` (existing anonymous auth setup)
- ADR 0001 (public storefront browsing)