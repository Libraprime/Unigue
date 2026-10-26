"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./mobile_menu";
import { BagIcon, HeartIcon } from "./icons";
import { useFirebase } from "./FirebaseProvider";
import { useShop } from "./ShopProvider";
import { signOutUser } from "./lib/auth";
import { getCategories } from "./lib/product";

/** Shared with MobileMenu so both menus always show the same destinations. */
export function useNavLinks() {
  return [
    { label: "Shop", href: "/#shop" },
    ...getCategories().map((c) => ({ label: c, href: `/?category=${encodeURIComponent(c)}#shop` })),
  ];
}

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="badge badge-accent badge-xs absolute -top-1 -right-1 px-1 font-semibold" aria-hidden="true">
      {count > 9 ? "9+" : count}
    </span>
  );
}

export default function Navbar() {
  const { auth, currentUser, loading } = useFirebase();
  const { cartCount, favorites } = useShop();
  const router = useRouter();
  const links = useNavLinks();
  const signedIn = !!currentUser && !currentUser.isAnonymous;
  const label = currentUser?.displayName || currentUser?.email || "Account";

  async function handleSignOut() {
    if (!auth) return;
    (document.activeElement as HTMLElement | null)?.blur();
    await signOutUser(auth);
    toast("Signed out");
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8" aria-label="Main">
        <div className="flex items-center gap-3">
          <MobileMenu links={links} />
          <Link href="/" className="flex items-center gap-2" aria-label="Unigue Stores home">
            <Logo width={32} height={32} />
            <span className="text-xl font-extrabold tracking-tight">Unigue.</span>
          </Link>
        </div>

        <ul className="hidden items-center gap-8 text-sm font-medium md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-accent transition-colors">{l.label}</Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Link href="/favorites" className="btn btn-ghost btn-circle relative" aria-label={`Favourites (${favorites.length})`}>
            <HeartIcon />
            <CountBadge count={favorites.length} />
          </Link>
          <Link href="/bag" className="btn btn-ghost btn-circle relative" aria-label={`Bag (${cartCount} items)`}>
            <BagIcon />
            <CountBadge count={cartCount} />
          </Link>

          {loading ? (
            // Reserve the slot so the bar doesn't jump when auth resolves.
            <span className="ml-2 inline-block h-8 w-16" aria-hidden="true" />
          ) : signedIn ? (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder" aria-label="Account menu">
                <span className="bg-neutral text-neutral-content w-9 rounded-full grid place-items-center text-sm font-semibold">
                  {label.charAt(0).toUpperCase()}
                </span>
              </button>
              <ul tabIndex={0} className="dropdown-content menu menu-sm z-50 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
                <li className="menu-title truncate">{label}</li>
                <li><Link href="/orders">Orders</Link></li>
                <li><Link href="/account">Account</Link></li>
                <li><button type="button" onClick={handleSignOut}>Sign out</button></li>
              </ul>
            </div>
          ) : (
            <Link href="/login" className="btn btn-sm btn-primary ml-2">Sign in</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
