"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { useFirebase } from "../FirebaseProvider";

/** Writes to `newsletter/{autoId}` (create-only; see firestore.rules). */
export default function Newsletter() {
  const { db } = useFirebase();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!db) {
      toast.error("Still connecting — please try again in a moment.");
      return;
    }
    setBusy(true);
    try {
      await addDoc(collection(db, "newsletter"), { email: email.trim().toLowerCase(), createdAt: serverTimestamp() });
      toast.success("You're subscribed. Welcome to Unigue!");
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error("Couldn't subscribe right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 md:px-8" aria-labelledby="newsletter-heading">
      <div className="rounded-box bg-neutral px-6 py-12 text-center text-neutral-content md:px-12">
        <h2 id="newsletter-heading" className="text-2xl font-bold md:text-3xl">Subscribe to our newsletter</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-neutral-content/70">
          New drops and offers from Unigue Stores, straight to your inbox.
        </p>
        <form onSubmit={onSubmit} className="join mx-auto mt-6 w-full max-w-md">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            aria-label="Email address"
            className="input join-item w-full text-base-content"
          />
          <button type="submit" disabled={busy} className="btn btn-accent join-item">
            {busy ? "..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
