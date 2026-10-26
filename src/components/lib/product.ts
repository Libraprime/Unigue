// Product catalog + the ONLY way the app reads products.
//
// Decision: docs/adr/0004-catalog-and-user-data-layer.md
// The catalog is static, so it lives in code behind getProducts()/getProduct().
// Nothing else may import PRODUCTS directly; when the catalog moves to
// Firestore/CMS (Phase 7) only this file changes.

export interface Product {
  id: number;
  name: string;
  category: string;
  /** Price in naira (whole numbers). Format with formatNaira(). */
  price: number;
  image: string;
  description: string;
  /** Shown in the "New arrivals" carousel on the home page. */
  isNew?: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Nike Air Max",
    category: "Footwear",
    price: 15000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500",
    description: "The Nike Air Max offers premium cushioning and a classic silhouette for everyday comfort.",
  },
  {
    id: 2,
    name: "Adidas Forum",
    category: "Footwear",
    price: 18500,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=500",
    description: "A hoops classic reborn. The Adidas Forum brings 80s basketball vibes to the modern street.",
  },
  {
    id: 3,
    name: "Puma Suede",
    category: "Footwear",
    price: 12000,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=500",
    description: "Timeless and iconic. The Puma Suede has been a cultural staple for over 50 years.",
  },
  {
    id: 4,
    name: "Reebok Classic",
    category: "Footwear",
    price: 14200,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500",
    description: "Clean, minimalist design that never goes out of style. Perfect for any casual outfit.",
    isNew: true,
  },
  {
    id: 5,
    name: "Gucci Ace",
    category: "Luxury",
    price: 450000,
    image: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?q=80&w=500",
    description: "Crafted from premium leather with iconic web detailing, representing the height of Italian luxury.",
    isNew: true,
  },
  {
    id: 6,
    name: "Prada Cloudbust",
    category: "Luxury",
    price: 520000,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500",
    description: "The Cloudbust Thunder features a complex, sculptural design with a chunky rubber lug sole.",
    isNew: true,
  },
];

export function getProducts(): Product[] {
  return PRODUCTS;
}

/** Accepts the raw route param (string) or a numeric id. */
export function getProduct(id: number | string): Product | undefined {
  const n = typeof id === "number" ? id : Number.parseInt(id, 10);
  if (Number.isNaN(n)) return undefined;
  return PRODUCTS.find((p) => p.id === n);
}

export function getCategories(): string[] {
  return Array.from(new Set(PRODUCTS.map((p) => p.category)));
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}
