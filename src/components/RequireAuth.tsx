"use client";

// The single auth guard for commitment points (checkout, orders, account).
// Policy and rationale: docs/adr/0006-auth-guard-and-commit-points.md
//
// Guests (anonymous sessions) are NOT considered signed in here. This is a UX
// guard only — Firebase auth is client-side, so real enforcement is the
// Firestore security rules (firestore.rules).

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFirebase } from "./FirebaseProvider";
import { withReturnTo } from "./lib/returnTo";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { currentUser, loading } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = !loading && !!currentUser && !currentUser.isAnonymous;

  useEffect(() => {
    if (loading || allowed) return;
    router.replace(withReturnTo("/login", pathname + window.location.search));
  }, [loading, allowed, pathname, router]);

  if (!allowed) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]" role="status" aria-label="Checking your session">
        <span className="loading loading-spinner loading-lg text-base-content/50" />
      </div>
    );
  }
  return <>{children}</>;
}
