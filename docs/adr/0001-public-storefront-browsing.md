# ADR 0001: Public storefront browsing, auth only at commitment points

## Status
Accepted

## Date
2026-09-09

## Context
The original app forced every visitor through a login/splash gate at `/`
before they could see any products — the actual storefront (Navbar, Hero,
product grid) only rendered at `/dashboard`, which was only reachable after
a successful login redirect.

This is a well-documented conversion killer in e-commerce UX. Baymard
Institute's checkout/browsing research repeatedly finds forced account
creation among the top causes of abandonment before a user ever sees what's
on offer. There's no reason to gate *browsing* — only actions that require
knowing who the user is (placing an order, viewing past orders, managing
account details) genuinely need authentication.

## Decision
The storefront (product browsing, search, filtering, product detail pages)
is public. Authentication is required only at commitment points: adding to
bag through to checkout, order history, and account settings. See
`REDESIGN_PLAN.md` Phases 2–3 for the implementation breakdown.

## Alternatives considered
- **Keep the full gate, just make it prettier.** Rejected — doesn't address
  the actual conversion problem, only its appearance.
- **Gate everything except the homepage (teaser only).** Rejected — still
  interrupts the browsing journey right when someone wants to see product
  detail, which is the moment they're most engaged.
- **No gate anywhere, including checkout.** Rejected — order fulfillment
  genuinely needs an identified user (shipping address, payment, support
  contact), so this isn't viable.

## Consequences
- **Easier:** SEO improves since product pages are crawlable without auth;
  new visitors can evaluate the product catalog before committing to an
  account, which should reduce bounce at the door.
- **Harder:** Every "commitment point" needs its own auth check now instead
  of one blanket gate — more surface area to get right, and to test. This is
  addressed by centralizing the check logic rather than duplicating it
  per-page (see Phase 3).
- **Depends on:** guest actions (favorites, cart) not being silently
  discarded when a user does eventually sign in — see ADR 0002.

## Related
- `REDESIGN_PLAN.md`, Phases 2 and 3
- ADR 0002 (guest session + account merge)