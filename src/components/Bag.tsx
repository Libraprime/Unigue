"use client";

import Image from "next/image";
import Link from "next/link";
import { MinusIcon, PlusIcon, TrashIcon } from "./icons";
import { useShop } from "./ShopProvider";
import { MAX_QTY } from "./lib/guest";
import { formatNaira, getProduct } from "./lib/product";

/**
 * Functional baseline for the bag (view, change quantity, remove, subtotal).
 * The reference-faithful bag/checkout design is Phase 7.
 */
export default function Bag() {
  const { loaded, cart, setQuantity, removeFromBag } = useShop();
  const lines = cart.flatMap((l) => {
    const product = getProduct(l.productId);
    return product ? [{ product, quantity: l.quantity }] : [];
  });
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading">
        <span className="loading loading-spinner loading-lg text-base-content/50" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Your bag is empty</h1>
        <p className="mt-2 text-base-content/70">Add something you like and it will show up here.</p>
        <Link href="/#shop" className="btn btn-primary mt-6">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <h1 className="mb-8 text-3xl font-bold">Your bag</h1>
      <div className="grid gap-10 md:grid-cols-[1fr_20rem]">
        <ul className="divide-y divide-base-300 border-y border-base-300">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="flex gap-4 py-5">
              <Link href={`/product/${product.id}`} className="relative size-24 shrink-0 overflow-hidden rounded-box bg-base-200">
                <Image src={product.image} alt={product.name} fill sizes="6rem" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link href={`/product/${product.id}`} className="font-semibold hover:underline">{product.name}</Link>
                    <p className="text-sm text-base-content/60">{product.category}</p>
                  </div>
                  <p className="font-semibold">{formatNaira(product.price * quantity)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="join">
                    <button type="button" className="btn btn-sm join-item" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity(product.id, quantity - 1)}>
                      <MinusIcon className="size-4" />
                    </button>
                    <span className="join-item grid w-10 place-items-center border border-base-300 text-sm" aria-live="polite">{quantity}</span>
                    <button type="button" className="btn btn-sm join-item" aria-label="Increase quantity" disabled={quantity >= MAX_QTY} onClick={() => setQuantity(product.id, quantity + 1)}>
                      <PlusIcon className="size-4" />
                    </button>
                  </div>
                  <button type="button" className="btn btn-ghost btn-sm text-error" onClick={() => removeFromBag(product.id)}>
                    <TrashIcon className="size-4" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-box border border-base-300 p-5">
          <h2 className="font-bold">Order summary</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-base-content/70">Subtotal</span>
            <span className="font-semibold">{formatNaira(subtotal)}</span>
          </div>
          <p className="mt-2 text-xs text-base-content/60">Delivery is calculated at checkout.</p>
          <Link href="/checkout" className="btn btn-primary mt-5 w-full">Checkout</Link>
          <p className="mt-3 text-center text-xs text-base-content/60">You&apos;ll be asked to sign in to check out.</p>
        </aside>
      </div>
    </div>
  );
}
