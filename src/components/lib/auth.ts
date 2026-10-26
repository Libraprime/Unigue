// All sign-up / sign-in flows live here so pages stay thin and the guest ->
// account behaviour is defined in exactly one place.
// Design: docs/adr/0002-guest-account-merge.md (sign-up / Google link)
//         docs/adr/0005-login-merges-guest-data.md  (login merge)

import {
  EmailAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  linkWithCredential,
  linkWithPopup,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type Auth,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, type Firestore } from "firebase/firestore";
import { mergeGuestData, readGuestData, type GuestData } from "./guest";

/** Creates `users/{uid}` once. Safe to call on every sign-in. */
async function ensureUserDoc(db: Firestore, user: User): Promise<void> {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;
  await setDoc(ref, {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    createdAt: serverTimestamp(),
  });
}

async function snapshotGuest(auth: Auth, db: Firestore): Promise<GuestData | null> {
  const guest = auth.currentUser;
  if (!guest?.isAnonymous) return null;
  try {
    return await readGuestData(db, guest.uid);
  } catch (err) {
    console.error("Could not read guest data before sign-in:", err);
    return null;
  }
}

async function mergeInto(db: Firestore, user: User, guest: GuestData | null): Promise<void> {
  if (!guest || (guest.cart.length === 0 && guest.favorites.length === 0)) return;
  try {
    await mergeGuestData(db, user.uid, guest);
  } catch (err) {
    // Signing in succeeded; losing a guest cart is not worth failing the login.
    console.error("Could not merge guest data:", err);
  }
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

/**
 * Guest session -> upgrade in place with linkWithCredential, so the UID (and
 * therefore the cart/favourites) is preserved. No session -> normal sign-up.
 * Throws `auth/email-already-in-use` if the email has an account already; the
 * caller should send the person to log in (which merges guest data).
 */
export async function signUpWithEmail(auth: Auth, db: Firestore, input: SignUpInput): Promise<User> {
  const { name, email, password } = input;
  const current = auth.currentUser;
  let user: User;

  if (current?.isAnonymous) {
    // Set the name first: linking triggers the token-changed event the UI
    // listens for, and we want the new name present when it re-renders.
    if (name) await updateProfile(current, { displayName: name });
    const result = await linkWithCredential(current, EmailAuthProvider.credential(email, password));
    user = result.user;
  } else {
    user = (await createUserWithEmailAndPassword(auth, email, password)).user;
    if (name) await updateProfile(user, { displayName: name });
  }

  await ensureUserDoc(db, user);
  return user;
}

/**
 * Existing account: a credential can't be linked onto a different account,
 * so sign in normally and merge whatever the guest session collected.
 */
export async function signInWithEmail(auth: Auth, db: Firestore, email: string, password: string): Promise<User> {
  const guest = await snapshotGuest(auth, db);
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  await mergeInto(db, user, guest);
  await ensureUserDoc(db, user);
  return user;
}

/**
 * Guest session -> try to link Google to it (keeps UID). If that Google
 * account already exists, fall back to signing into it and merging.
 * NOTE: must be called directly from a click handler (popup blockers).
 */
export async function signInWithGoogle(auth: Auth, db: Firestore): Promise<User> {
  const provider = new GoogleAuthProvider();
  const current = auth.currentUser;
  let user: User;

  if (current?.isAnonymous) {
    try {
      user = (await linkWithPopup(current, provider)).user;
    } catch (err) {
      const code = (err as { code?: string }).code;
      const credential = GoogleAuthProvider.credentialFromError(err as never);
      if (code !== "auth/credential-already-in-use" || !credential) throw err;
      const guest = await snapshotGuest(auth, db);
      user = (await signInWithCredential(auth, credential)).user;
      await mergeInto(db, user, guest);
    }
  } else {
    user = (await signInWithPopup(auth, provider)).user;
  }

  await ensureUserDoc(db, user);
  return user;
}

export function signOutUser(auth: Auth): Promise<void> {
  return signOut(auth);
}

/** Maps Firebase error codes to messages safe to show people. */
export function authErrorMessage(err: unknown): string {
  const code = typeof err === "object" && err !== null && "code" in err ? String((err as { code: unknown }).code) : "";
  switch (code) {
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please log in instead.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-login-credentials":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network problem. Check your connection and try again.";
    case "auth/popup-blocked":
      return "Your browser blocked the sign-in popup. Allow popups and try again.";
    case "auth/operation-not-allowed":
      return "This sign-in method isn't enabled yet.";
    default:
      return "Something went wrong. Please try again.";
  }
}

/** True when the person closed the popup themselves (not an error worth showing). */
export function isPopupDismissed(err: unknown): boolean {
  const code = typeof err === "object" && err !== null && "code" in err ? String((err as { code: unknown }).code) : "";
  return code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request";
}
