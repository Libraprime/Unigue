"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useReducer, useRef, useState, type ReactNode } from "react";
import { type FirebaseApp } from "firebase/app";
import { type Analytics } from "firebase/analytics";
import { type Firestore } from "firebase/firestore";
import {
  type Auth,
  type User,
  onAuthStateChanged,
  onIdTokenChanged,
  signInAnonymously,
  signInWithCustomToken,
} from "firebase/auth";

import { app, analytics, db, auth } from "./lib/firebase";

// Provided by the Canvas environment; undefined everywhere else.
declare let __initial_auth_token: string | undefined;

interface FirebaseServices {
  app: FirebaseApp | null;
  analytics: Analytics | undefined;
  auth: Auth | undefined;
  db: Firestore | undefined;
  currentUser: User | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseServices>({
  app,
  analytics: undefined,
  auth: undefined,
  db: undefined,
  currentUser: null,
  loading: true,
});

export const useFirebase = () => useContext(FirebaseContext);

/**
 * Pages where we must NOT silently create a guest session: someone arriving
 * cold at the login/register screen should get a plain account, not a
 * throwaway anonymous one. Case-insensitive because the register route is
 * `/signUp` (this used to compare against `/signup` and never matched).
 */
const AUTH_PATHS = ["/login", "/signup", "/forgot-password"];
const isAuthPath = (pathname: string) => AUTH_PATHS.includes(pathname.toLowerCase());

/**
 * Does NOT block rendering while auth resolves. It used to return a full-page
 * "Loading..." until the first auth event, which meant the server-rendered
 * HTML of every page was an empty spinner — defeating ADR 0001's "crawlable
 * without auth" goal. Auth-dependent UI now reads `loading` from the context
 * (Navbar shows a placeholder, RequireAuth shows a spinner).
 */
export default function FirebaseProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // If Auth failed to initialise there is nothing to wait for.
  const [loading, setLoading] = useState<boolean>(!!auth);
  // Linking an anonymous user to an email/Google account keeps the same User
  // object (so React state doesn't change) but flips `isAnonymous`. Bumping
  // this on token changes re-renders consumers so they see the new state.
  const [, bumpRevision] = useReducer((n: number) => n + 1, 0);
  const pathname = usePathname();
  const anonymousInFlight = useRef(false);

  // Listen for auth state + token changes.
  useEffect(() => {
    if (!auth) {
      console.error("Firebase Auth service is not available.");
      return;
    }
    const offState = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    const offToken = onIdTokenChanged(auth, () => bumpRevision());
    return () => {
      offState();
      offToken();
    };
  }, []);

  // Give every visitor a guest session once we know there is no user, except
  // on auth pages. Re-runs after sign-out, so the storefront never sits
  // without a session. (ADR 0002)
  useEffect(() => {
    if (!auth || loading || currentUser || isAuthPath(pathname) || anonymousInFlight.current) return;
    anonymousInFlight.current = true;
    const start =
      typeof __initial_auth_token !== "undefined"
        ? signInWithCustomToken(auth, __initial_auth_token)
        : signInAnonymously(auth);
    start
      .catch((error) => {
        // Most likely cause: Anonymous sign-in is not enabled in the Firebase
        // console (see docs/SETUP.md).
        console.error("Guest sign-in failed:", error);
      })
      .finally(() => {
        anonymousInFlight.current = false;
      });
  }, [loading, currentUser, pathname]);

  return (
    <FirebaseContext.Provider value={{ app, analytics, auth, db, currentUser, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
}
