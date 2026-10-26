"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useFirebase } from "./FirebaseProvider";
import { authErrorMessage, isPopupDismissed, signInWithGoogle } from "./lib/auth";
import { safeReturnTo } from "./lib/returnTo";

/**
 * "Continue with Google". From a guest session this LINKS Google to the guest
 * (same UID, cart kept); if that Google account already exists it signs in and
 * merges the guest data instead (docs/adr/0002, 0005).
 */
export default function Oauth({ returnTo = "/" }: { returnTo?: string }) {
  const router = useRouter();
  const { auth, db } = useFirebase();

  async function onClick() {
    if (!auth || !db) {
      toast.error("Sign-in isn't ready yet. Please try again.");
      return;
    }
    try {
      await signInWithGoogle(auth, db);
      router.push(safeReturnTo(returnTo));
    } catch (err) {
      if (isPopupDismissed(err)) return;
      console.error("Google sign-in error:", err);
      toast.error(authErrorMessage(err));
    }
  }

  return (
    <button type="button" onClick={onClick} className="btn btn-outline w-full gap-3">
      <Image src="/google.png" alt="" width={20} height={20} />
      Continue with Google
    </button>
  );
}
