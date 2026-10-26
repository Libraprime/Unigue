# ADR 0005: Logging in to an existing account merges guest data instead of linking

## Status
Accepted

## Date
2026-10-20

## Context
ADR 0002 says to call `linkWithCredential` "on signup or login" so a guest's
bag and favourites survive. That works for sign-up: a brand-new credential is
attached to the guest's UID. It cannot work for **login**: an existing
account's credential is already attached to a different UID, so Firebase
rejects the link (`auth/credential-already-in-use` / `auth/email-already-in-use`).
ADR 0002 flagged this edge case and left the handling open ("fall back to a
normal sign-in and optionally offer to merge carts").

## Decision
- **Sign up (email or Google), guest session present:** link to the guest UID
  (`linkWithCredential` / `linkWithPopup`). No data moves.
- **Log in (email), or Google where the account already exists, guest session
  present:** read the guest's bag and favourites first, sign in, then merge
  them into the account (quantities add up, capped at 10; favourites are a
  set union). The abandoned anonymous user is left to Firebase.
- **Merge is automatic, not an offer.** It is additive and never deletes
  anything from the account, so there is nothing to confirm.
- If sign-up hits `auth/email-already-in-use`, the form tells the person to log
  in instead (preserving `returnTo`), where the merge happens.
- A failed merge never fails the login; it is logged.

All of this lives in `src/components/lib/auth.ts` and `lib/guest.ts`.

## Alternatives considered
- **Prompt the person to merge.** Rejected: additive merge has no downside
  worth a modal, and an extra step at login is the friction ADR 0001 removes.
- **Discard the guest data on login.** Rejected: contradicts guiding principle 2
  ("no guest data loss").
- **Server-side merge (Cloud Function).** Rejected for now: needs backend
  infrastructure the project doesn't have; the client has everything it needs.

## Consequences
- **Easier:** One predictable rule; no data loss in either path.
- **Harder:** The merge runs in the browser, so it is not atomic. A tab closed
  mid-merge could leave a partial merge (re-adding is harmless). Orphaned
  anonymous users accumulate in Firebase Auth; enable Firebase's automatic
  cleanup of old anonymous accounts (see `docs/SETUP.md`).
- Supersedes nothing; **clarifies ADR 0002**.

## Related
- ADR 0002, ADR 0004
- `REDESIGN_PLAN.md`, Phase 4
