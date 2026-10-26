"use client";

import { useRouter } from "next/navigation";
import { HeartIcon } from "./icons";
import { useShop } from "./ShopProvider";

/**
 * Add to bag / Favourite / Buy now, shared by the product page and the
 * quick-view modal. "Buy now" adds one to the bag and goes to /checkout,
 * which is where the auth guard applies (ADR 0006).
 */
export default function ProductActions({ productId, onNavigate }: { productId: number; onNavigate?: () => void }) {
  const { addToBag, toggleFavorite, isFavorite } = useShop();
  const router = useRouter();
  const favorite = isFavorite(productId);

  async function buyNow() {
    await addToBag(productId);
    // From the modal, close it first so we don't leave an overlay behind.
    onNavigate?.();
    router.push("/checkout");
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="flex gap-3">
        <button type="button" className="btn btn-primary flex-1" onClick={() => addToBag(productId)}>
          Add to bag
        </button>
        <button
          type="button"
          className="btn btn-outline btn-square"
          onClick={() => toggleFavorite(productId)}
          aria-pressed={favorite}
          aria-label={favorite ? "Remove from favourites" : "Save to favourites"}
        >
          <HeartIcon filled={favorite} className={`size-5 ${favorite ? "text-error" : ""}`} />
        </button>
      </div>
      <button type="button" className="btn btn-outline w-full" onClick={buyNow}>
        Buy now
      </button>
    </div>
  );
}
