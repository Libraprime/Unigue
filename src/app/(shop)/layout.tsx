import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Storefront shell. Route groups don't change URLs, so `/`, `/product/[id]`,
// `/bag`, `/favorites`, ... all share the navbar + footer, while the auth
// pages in `(auth)` keep their own split-screen layout.
export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
