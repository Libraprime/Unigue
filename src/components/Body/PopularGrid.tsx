"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Card from "./Card";
import { getCategories, getProducts } from "../lib/product";

type Sort = "featured" | "price-asc" | "price-desc";

/**
 * "Popular for you" grid. Category comes from the URL (`/?category=Luxury`) so
 * navbar/footer links and refreshes work; sorting is local UI state.
 * Colour/size/gender/brand filters need data the catalog doesn't have yet —
 * tracked as Phase 7 in docs/REDESIGN_PLAN.md.
 */
const CATEGORIES = getCategories();

export default function PopularGrid() {
  const params = useSearchParams();
  const [sort, setSort] = useState<Sort>("featured");
  const categories = CATEGORIES;
  const requested = params.get("category");
  const active = categories.find((c) => c.toLowerCase() === requested?.toLowerCase()) ?? null;

  // Six products today; if the catalog grows large, move this server-side.
  const filtered = getProducts().filter((p) => !active || p.category === active);
  const products =
    sort === "price-asc" ? [...filtered].sort((a, b) => a.price - b.price)
    : sort === "price-desc" ? [...filtered].sort((a, b) => b.price - a.price)
    : filtered;

  const chip = (isActive: boolean) =>
    `btn btn-sm ${isActive ? "btn-neutral" : "btn-outline"}`;

  return (
    <section id="shop" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 md:px-8" aria-labelledby="popular-heading">
      <h2 id="popular-heading" className="mb-8 text-center text-3xl font-bold md:text-4xl">Popular for you</h2>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-base-300 py-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <Link href="/#shop" scroll={false} replace className={chip(!active)} aria-current={!active ? "true" : undefined}>All</Link>
          {categories.map((c) => (
            <Link key={c} href={`/?category=${encodeURIComponent(c)}#shop`} scroll={false} replace className={chip(active === c)} aria-current={active === c ? "true" : undefined}>
              {c}
            </Link>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-base-content/70">Sort by</span>
          <select className="select select-sm" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <Card key={p.id} product={p} priority={i < 3} />
        ))}
      </div>
    </section>
  );
}
