"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import PasswordInput from "@/components/auth/PasswordInput";
import Oauth from "@/components/Oauth";
import { useFirebase } from "@/components/FirebaseProvider";
import { authErrorMessage, signUpWithEmail } from "@/components/lib/auth";
import { withReturnTo } from "@/components/lib/returnTo";

export default function Register({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const { auth, db } = useFirebase();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailTaken, setEmailTaken] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setEmailTaken(false);

    if (!agreed) return setError("You must agree to the Terms and Conditions.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (!auth || !db) return setError("Sign-up isn't ready yet. Please try again.");

    setBusy(true);
    try {
      // From a guest session this upgrades the guest in place (cart kept).
      await signUpWithEmail(auth, db, { name: name.trim(), email, password });
      router.push(returnTo);
    } catch (err) {
      console.error(err);
      setEmailTaken((err as { code?: string }).code === "auth/email-already-in-use");
      setError(authErrorMessage(err));
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Save your bag and favourites, and check out faster">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">Full name</label>
          <input id="name" name="name" type="text" required autoComplete="name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="input w-full" />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="account@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input w-full" />
        </div>

        <PasswordInput id="password" label="Password" value={password} onChange={setPassword} placeholder="At least 6 characters" autoComplete="new-password" />
        <PasswordInput id="confirm-password" label="Confirm password" value={confirm} onChange={setConfirm} placeholder="Repeat your password" autoComplete="new-password" />

        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input type="checkbox" className="checkbox checkbox-sm mt-0.5" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>
            I agree to the{" "}
            <Link className="font-semibold underline" href="/Info/termsConditions">Terms and Conditions</Link> &amp;{" "}
            <Link className="font-semibold underline" href="/Info/privacy_policy">Privacy Policy</Link>
          </span>
        </label>

        {error && (
          <p role="alert" className="text-sm text-error">
            {error}{" "}
            {emailTaken && <Link href={withReturnTo("/login", returnTo)} className="font-semibold underline">Log in</Link>}
          </p>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy ? <span className="loading loading-spinner loading-sm" /> : "Create account"}
        </button>

        <div className="divider text-xs">OR</div>
        <Oauth returnTo={returnTo} />

        <p className="pt-2 text-sm text-base-content/70">
          Already have an account?{" "}
          <Link href={withReturnTo("/login", returnTo)} className="font-semibold text-base-content hover:underline">Log in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
