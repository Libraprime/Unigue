import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductActions from "@/components/ProductActions";
import { ArrowLeftIcon } from "@/components/icons";
import { formatNaira, getProduct, getProducts } from "@/components/lib/product";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return getProducts().map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: [product.image] },
  };
}

// Full product page: what you get on a hard load or refresh of /product/[id].
// In-app clicks from the storefront show the quick-view modal instead
// (app/@modal/(.)product/[id]).
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <Link href="/#shop" className="mb-6 inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-base-content">
        <ArrowLeftIcon className="size-4" /> Continue shopping
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-4/5 overflow-hidden rounded-box bg-base-200">
          <Image src={product.image} alt={product.name} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>

        <div className="space-y-5 md:pt-4">
          <p className="text-sm uppercase tracking-widest text-base-content/60">{product.category}</p>
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-3xl font-semibold">{formatNaira(product.price)}</p>
          <div className="divider my-2" />
          <div>
            <h2 className="mb-2 text-lg font-bold">Description</h2>
            <p className="leading-relaxed text-base-content/80">{product.description}</p>
          </div>
          <ProductActions productId={product.id} />
        </div>
      </div>
    </div>
  );
}
