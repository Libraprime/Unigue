"use client";

import Link from "next/link";
import Card from "./Body/Card";
import { useShop } from "./ShopProvider";
import { getProduct } from "./lib/product";

export default function Favorites() {
  const { loaded, favorites } = useShop();
  const products = favorites.flatMap((id) => {
    const p = getProduct(id);
    return p ? [p] : [];
  });

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading">
        <span className="loading loading-spinner loading-lg text-base-content/50" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">No favourites yet</h1>
        <p className="mt-2 text-base-content/70">Tap the heart on any product to save it here.</p>
        <Link href="/#shop" className="btn btn-primary mt-6">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <h1 className="mb-8 text-3xl font-bold">Favourites</h1>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Card key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
