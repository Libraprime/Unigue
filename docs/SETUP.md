# Setup

## Run locally

```bash
npm install        # the repo has package-lock.json
npm run dev        # next dev --turbopack
npm run lint       # eslint .
npx tsc --noEmit   # type check
npm run build      # production build (needs internet for Google Fonts)
```

`next/font/google` downloads Geist, Geist Mono and Open Sans at build time. A
build on an offline machine fails for that reason alone.

## Environment

Create `.env.local` (gitignored) with your Firebase web app config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## Firebase console checklist (the app does not work without these)

1. **Authentication → Sign-in method:** enable **Anonymous** (guest bag and
   favourites), **Email/Password**, and **Google**.
2. **Authentication → Settings → Authorized domains:** add every domain the
   app is served from (Google sign-in popup fails otherwise).
3. **Firestore:** create the database, then deploy `firestore.rules`:
   ```bash
   npm i -g firebase-tools
   firebase login
   firebase use <your-project-id>      # creates .firebaserc (commit it or not, your call)
   firebase deploy --only firestore:rules
   ```
   **Compare with your current rules first.** `firestore.rules` is written for
   the collections in `docs/ARCHITECTURE.md` and denies everything else; if the
   project has other collections in use, merge instead of overwriting.
4. *(Recommended)* Anonymous users accumulate (every first visit creates one).
   If the project is upgraded to Identity Platform, enable automatic clean-up
   of old anonymous accounts.

## Symptoms and causes

| Symptom | Likely cause |
|---|---|
| "Still connecting..." toast on Add to bag | Anonymous sign-in not enabled (console log: `Guest sign-in failed`) |
| "Couldn't load your bag and favourites" toast | `firestore.rules` not deployed, or rules block `users/{uid}/...` |
| Google popup closes with an error | Domain missing from Authorized domains |
| Newsletter says "Couldn't subscribe" | Rules not deployed (needs the `newsletter` create rule) |
