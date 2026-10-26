"use client";

import Image from "next/image";
import Link from "next/link";
import { HeartIcon, BagIcon } from "../icons";
import { useShop } from "../ShopProvider";
import { formatNaira, type Product } from "../lib/product";

/**
 * Product tile used on the home grid, the new-arrivals carousel and the
 * favourites page. The image links to /product/[id]; on the storefront that
 * soft navigation is intercepted by app/@modal/(.)product/[id] (quick view).
 * Actions are siblings of the links (never nested inside an <a>).
 */
export default function Card({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addToBag, toggleFavorite, isFavorite } = useShop();
  const favorite = isFavorite(product.id);
  const href = `/product/${product.id}`;

  return (
    <article className="group w-full">
      <div className="relative">
        <Link href={href} scroll={false} aria-label={`View ${product.name}`} className="block">
          <div className="relative aspect-4/5 overflow-hidden rounded-box bg-base-200">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 80vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          aria-pressed={favorite}
          aria-label={favorite ? `Remove ${product.name} from favourites` : `Save ${product.name} to favourites`}
          className="btn btn-circle btn-sm absolute right-3 top-3 border-0 bg-base-100/90 shadow"
        >
          <HeartIcon filled={favorite} className={`size-4 ${favorite ? "text-error" : ""}`} />
        </button>

        {/* Always visible on touch screens; revealed on hover/focus from md up. */}
        <button
          type="button"
          onClick={() => addToBag(product.id)}
          className="btn btn-neutral btn-sm absolute inset-x-3 bottom-3 gap-2 transition md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100"
        >
          <BagIcon className="size-4" /> Add to bag
        </button>

        {product.isNew && (
          <span className="badge badge-accent absolute left-3 top-3 font-semibold">New</span>
        )}
      </div>

      <Link href={href} scroll={false} className="mt-3 block space-y-0.5">
        <h3 className="font-semibold leading-snug">{product.name}</h3>
        <p className="text-sm text-base-content/60">{product.category}</p>
        <p className="font-semibold">{formatNaira(product.price)}</p>
      </Link>
    </article>
  );
}
