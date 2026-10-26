"use client";

import { useRef } from "react";
import Card from "./Card";
import { ArrowLeftIcon, ArrowRightIcon } from "../icons";
import type { Product } from "../lib/product";

export default function NewArrivals({ products }: { products: Product[] }) {
  const track = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) =>
    track.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8" aria-labelledby="new-arrivals">
      <div className="grid gap-8 md:grid-cols-[16rem_1fr]">
        <div>
          <h2 id="new-arrivals" className="text-4xl font-bold leading-tight">New arrivals</h2>
          <p className="mt-3 text-sm text-base-content/70">Fresh pairs, just landed. Be first to lace them up.</p>
          <div className="mt-6 flex gap-2">
            <button type="button" className="btn btn-outline btn-circle btn-sm" aria-label="Previous" onClick={() => scrollBy(-1)}>
              <ArrowLeftIcon className="size-4" />
            </button>
            <button type="button" className="btn btn-outline btn-circle btn-sm" aria-label="Next" onClick={() => scrollBy(1)}>
              <ArrowRightIcon className="size-4" />
            </button>
          </div>
        </div>

        <div ref={track} className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
          {products.map((p) => (
            <div key={p.id} className="w-60 shrink-0 snap-start sm:w-64">
              <Card product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
