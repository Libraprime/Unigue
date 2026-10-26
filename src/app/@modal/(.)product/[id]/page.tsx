"use client";

// Quick-view modal. Next intercepts soft navigations to /product/[id] and
// renders this over the current page; a hard load shows the full page at
// app/(shop)/product/[id]. The folder name MUST match the route segment
// ("product", singular) — it was "products" before Phase 6, so this never fired.

import { use, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProductActions from "@/components/ProductActions";
import { ArrowRightIcon, CloseIcon } from "@/components/icons";
import { formatNaira, getProduct } from "@/components/lib/product";

export default function ProductModal({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const product = getProduct(id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && router.back();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [router]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={product.name}>
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => router.back()} />
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-box bg-base-100 p-5 text-base-content shadow-2xl">
        <button type="button" onClick={() => router.back()} className="btn btn-circle btn-sm absolute right-4 top-4 z-10" aria-label="Close">
          <CloseIcon className="size-4" />
        </button>

        <div className="relative aspect-square w-full overflow-hidden rounded-box bg-base-200">
          <Image src={product.image} alt={product.name} fill sizes="32rem" className="object-cover" />
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-xs uppercase tracking-widest text-base-content/60">{product.category}</p>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-xl font-semibold">{formatNaira(product.price)}</p>
          <p className="text-sm text-base-content/80">{product.description}</p>

          {/* Plain <a> on purpose: a full navigation skips the interception and opens the full page. */}
          <a href={`/product/${product.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-base-content/70 transition-colors hover:text-base-content">
            View full details <ArrowRightIcon className="size-4" />
          </a>

          <ProductActions productId={product.id} onNavigate={() => router.back()} />
        </div>
      </div>
    </div>
  );
}
