import Link from "next/link";
import Logo from "./Logo";
import { getCategories } from "./lib/product";

/** Dark footer. Every link points at a real route (no placeholders). */
export default function Footer() {
  const col = "flex flex-col gap-2";
  const title = "mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-content/60";
  const link = "text-neutral-content/80 hover:text-accent transition-colors";

  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2" aria-label="Unigue Stores home">
            <Logo width={36} height={36} />
            <span className="text-xl font-extrabold">Unigue.</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-neutral-content/70">
            Sneakers and luxury footwear, delivered across Nigeria.
          </p>
        </div>

        <nav aria-label="Shop" className={col}>
          <h2 className={title}>Shop</h2>
          <Link href="/#shop" className={link}>All products</Link>
          {getCategories().map((c) => (
            <Link key={c} href={`/?category=${encodeURIComponent(c)}#shop`} className={link}>{c}</Link>
          ))}
        </nav>

        <nav aria-label="Your account" className={col}>
          <h2 className={title}>Your account</h2>
          <Link href="/bag" className={link}>Bag</Link>
          <Link href="/favorites" className={link}>Favourites</Link>
          <Link href="/orders" className={link}>Orders</Link>
          <Link href="/account" className={link}>Account</Link>
        </nav>

        <nav aria-label="Legal" className={col}>
          <h2 className={title}>Legal</h2>
          <Link href="/Info/termsConditions" className={link}>Terms and conditions</Link>
          <Link href="/Info/privacy_policy" className={link}>Privacy policy</Link>
        </nav>
      </div>
      <div className="border-t border-neutral-content/10 py-5 text-center text-xs text-neutral-content/50">
        © {new Date().getFullYear()} Unigue Stores. All rights reserved.
      </div>
    </footer>
  );
}
