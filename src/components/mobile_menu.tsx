"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFirebase } from "./FirebaseProvider";
import { useShop } from "./ShopProvider";
import { CloseIcon, MenuIcon } from "./icons";

interface NavLink {
  label: string;
  href: string;
}

/**
 * Slide-in menu for small screens (the desktop links live in Navbar). Bag and
 * favourite counts come from ShopProvider — this component no longer opens
 * its own Firestore listener.
 */
export default function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const { currentUser } = useFirebase();
  const { cartCount, favorites } = useShop();
  const signedIn = !!currentUser && !currentUser.isAnonymous;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);
  const item = "block py-3 text-lg font-medium border-b border-base-300";

  return (
    <div className="md:hidden">
      <button type="button" className="btn btn-ghost btn-circle" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
        <MenuIcon />
      </button>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/50" onClick={close} />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col bg-base-100 p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-bold">Menu</p>
              <button type="button" className="btn btn-ghost btn-circle btn-sm" aria-label="Close menu" onClick={close}>
                <CloseIcon />
              </button>
            </div>
            <p className="mb-2 text-sm text-base-content/70">
              {signedIn ? `Hi, ${currentUser?.displayName || currentUser?.email}` : "Browsing as guest"}
            </p>
            <nav className="flex flex-col" onClick={close}>
              {links.map((l) => (
                <Link key={l.href} href={l.href} className={item}>{l.label}</Link>
              ))}
              <Link href="/bag" className={item}>Bag ({cartCount})</Link>
              <Link href="/favorites" className={item}>Favourites ({favorites.length})</Link>
              {signedIn ? (
                <>
                  <Link href="/orders" className={item}>Orders</Link>
                  <Link href="/account" className={item}>Account</Link>
                </>
              ) : (
                <Link href="/login" className={item}>Sign in</Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
