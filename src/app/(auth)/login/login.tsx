"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import PasswordInput from "@/components/auth/PasswordInput";
import Oauth from "@/components/Oauth";
import { useFirebase } from "@/components/FirebaseProvider";
import { authErrorMessage, signInWithEmail } from "@/components/lib/auth";
import { withReturnTo } from "@/components/lib/returnTo";

export default function Login({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const { auth, db, currentUser } = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already signed in with a real account? Nothing to do here.
  useEffect(() => {
    if (currentUser && !currentUser.isAnonymous) router.replace(returnTo);
  }, [currentUser, returnTo, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth || !db) {
      setError("Sign-in isn't ready yet. Please try again.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signInWithEmail(auth, db, email, password);
      router.push(returnTo);
    } catch (err) {
      console.error(err);
      setError(authErrorMessage(err));
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Log in to your Unigue account">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="account@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input w-full" />
        </div>

        <PasswordInput id="password" label="Password" value={password} onChange={setPassword} placeholder="Your password" />

        <div className="text-right">
          <Link href="/forgot-password" className="text-sm hover:underline">Forgot password?</Link>
        </div>

        {error && <p role="alert" className="text-sm text-error">{error}</p>}

        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy ? <span className="loading loading-spinner loading-sm" /> : "Log in"}
        </button>

        <div className="divider text-xs">OR</div>
        <Oauth returnTo={returnTo} />

        <p className="pt-2 text-sm text-base-content/70">
          Don&apos;t have an account?{" "}
          <Link href={withReturnTo("/signUp", returnTo)} className="font-semibold text-base-content hover:underline">Register</Link>
        </p>
      </form>
    </AuthShell>
  );
}
