"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import AuthShell from "@/components/auth/AuthShell";
import { useFirebase } from "@/components/FirebaseProvider";

export default function ForgotPassword() {
  const { auth } = useFirebase();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSent(false);
    if (!auth) return setError("Auth service is not available.");

    setBusy(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      console.error(err);
      const code = (err as { code?: string }).code;
      setError(
        code === "auth/invalid-email" || code === "auth/user-not-found"
          ? "Invalid email address."
          : "Failed to send reset email. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Forgot password" subtitle="We'll email you a link to reset it">
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" placeholder="account@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input w-full" />
        </div>

        {error && <p role="alert" className="text-sm text-error">{error}</p>}
        {sent && <p role="status" className="text-sm text-success">Password reset email sent. Please check your inbox.</p>}

        <button type="submit" className="btn btn-primary w-full" disabled={busy}>
          {busy ? <span className="loading loading-spinner loading-sm" /> : "Send reset link"}
        </button>

        <Link href="/login" className="inline-block text-sm hover:underline">Back to login</Link>
      </form>
    </AuthShell>
  );
}
