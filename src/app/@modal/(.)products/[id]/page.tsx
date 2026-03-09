// src/app/@modal/(.)product/[id]/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Use Link for the 'View More'
import { PRODUCTS } from "@/components/lib/product";
import Image from "next/image";

export default function ProductModal({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const product = PRODUCTS.find((p) => p.id === parseInt(id));

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl max-w-lg w-full relative shadow-2xl">
        {/* Close Button */}
        <button onClick={() => router.back()} className="absolute top-4 right-4 btn btn-circle btn-sm">✕</button>
        
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>

        <div className="mt-6">
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <p className="text-2xl font-bold text-primary mt-2">₦{product.price}</p>

          {/* NEW: View More Link */}
          <button 
            onClick={() => window.location.href = `/product/${id}`}
            className="mt-4 text-sm font-medium text-gray-500 hover:text-primary flex items-center gap-1 transition-colors"
          >
            View full details 
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
          
          <div className="mt-8 flex gap-3">
            <button className="btn btn-primary flex-1">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}