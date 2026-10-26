// src/lib/products.ts

export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Nike Air Max",
    category: "Footwear",
    price: "15,000",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500",
    description: "The Nike Air Max offers premium cushioning and a classic silhouette for everyday comfort."
  },
  {
    id: 2,
    name: "Adidas Forum",
    category: "Footwear",
    price: "18,500",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=500",
    description: "A hoops classic reborn. The Adidas Forum brings 80s basketball vibes to the modern street."
  },
  {
    id: 3,
    name: "Puma Suede",
    category: "Footwear",
    price: "12,000",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=500",
    description: "Timeless and iconic. The Puma Suede has been a cultural staple for over 50 years."
  },
  {
    id: 4,
    name: "Reebok Classic",
    category: "Footwear",
    price: "14,200",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500",
    description: "Clean, minimalist design that never goes out of style. Perfect for any casual outfit."
  },
  {
    id: 5,
    name: "Gucci Ace",
    category: "Luxury",
    price: "450,000",
    image: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?q=80&w=500",
    description: "Crafted from premium leather with iconic web detailing, representing the height of Italian luxury."
  },
  {
    id: 6,
    name: "Prada Cloudbust",
    category: "Luxury",
    price: "520,000",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500",
    description: "The Cloudbust Thunder features a complex, sculptural design with a chunky rubber lug sole."
  }
];