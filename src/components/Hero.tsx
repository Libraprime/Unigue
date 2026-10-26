import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "./icons";
import { formatNaira, getProducts } from "./lib/product";

/** Server component. Featured tile = first product flagged `isNew`. */
export default function Hero() {
  const products = getProducts();
  const featured = products.find((p) => p.isNew) ?? products[0];

  return (
    <section className="bg-neutral text-neutral-content">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:px-8 md:py-24">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-accent">New season</p>
          <h1 className="text-6xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
            Step into
            <span className="block text-accent">Unigue</span>
          </h1>
          <p className="mt-6 max-w-md text-neutral-content/70">
            Everyday sneakers and luxury statement pairs from the brands you know, delivered across Nigeria.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/#shop" className="btn btn-accent">
              Shop now <ArrowRightIcon className="size-4" />
            </Link>
            <Link href="/?category=Luxury#shop" className="btn btn-outline border-neutral-content/40 text-neutral-content hover:border-neutral-content hover:bg-neutral-content hover:text-neutral">
              Luxury edit
            </Link>
          </div>
        </div>

        <Link href={`/product/${featured.id}`} className="group relative block aspect-4/5 w-full max-w-md justify-self-center overflow-hidden rounded-box md:justify-self-end" aria-label={`Featured: ${featured.name}`}>
          <Image
            src={featured.image}
            alt={featured.name}
            fill
            priority
            sizes="(min-width: 768px) 28rem, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-5 text-white">
            <p className="text-xs uppercase tracking-widest text-white/70">Just in</p>
            <p className="text-lg font-bold">{featured.name}</p>
            <p>{formatNaira(featured.price)}</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
