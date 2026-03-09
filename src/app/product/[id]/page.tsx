'use client'

import React from "react";
import { PRODUCTS } from "@/components/lib/product";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/router";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  // 1. Unwrap the params
  const { id } =  React.use(params);

  // 2. Find the product in your local array
  // We use parseInt because your ID in the array is a number, but the URL ID is a string
  const product = PRODUCTS.find((p) => p.id === parseInt(id));

  // 3. If it doesn't exist, show 404
  if (!product) return notFound();

  return (
    <div className="container mx-auto p-5 py-10 md:flex gap-10 min-h-screen">
      {/* Product Images Section */}
      <div className="md:w-1/2">
        <div className="relative aspect-square md:aspect-4/5 overflow-hidden rounded-2xl bg-gray-100">
          <Image 
            src={product.image} 
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Product Details Section */}
      <div className="md:w-1/2 space-y-6 mt-5 md:mt-0">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">{product.category}</p>
            <h1 className="text-4xl font-bold">{product.name}</h1>
          </div>
          <button onClick={router.back} className="btn btn-ghost btn-circle">
            ✕
          </button>
        </div>
        
        <p className="text-3xl font-semibold text-primary">₦{product.price}</p>
        
        <div className="divider"></div>
        
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Product Description</h3>
          <p className="text-gray-600 leading-relaxed">
            This is a premium {product.name} from our {product.category} collection. 
            Currently showing local data from the lib folder.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button className="btn btn-primary flex-1 btn-lg">Add to Cart</button>
          <button className="btn btn-outline flex-1 btn-lg">Buy Now</button>
        </div>
      </div>
    </div>
  );
}