'use client'

import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Card({ product }: { product: { id: number; name: string; category: string; price: string; image: string } }) {
  return (
    // 1. Ensure this path matches your folder name (e.g., /products/)
    // 2. Add scroll={false} to keep the background page from jumping
    <Link href={`/product/${product.id}`} scroll={false} className="block group">
      <div className="min-w-62.5 snap-center">
        <div className="relative group">
          
          {/* Action Buttons */}
          {/* Use e.preventDefault() if you add actual logic to these buttons later 
              to prevent the Link from triggering when you just want to "Like" */}
          <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
            <div className="flex justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
              <button 
                onClick={(e) => { 
                  e.preventDefault(); /* Add to cart logic */ 
                  console.log('Added to cart')
                  toast.success('Added to cart')
                }} 
                className="btn btn-circle btn-sm shadow-md"
              >
                +
              </button>
              <button 
                onClick={(e) => { 
                  e.preventDefault(); /* Like logic */ 
                  console.log('Added to favourites') 
                  toast.success('Successfully added to Favourites')
                }} 
                className="btn btn-circle btn-sm shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Product Image */}
          <div className="rounded-xl overflow-hidden bg-gray-light/20 aspect-4/5 relative">
            <Image 
              src={product.image}  
              alt={product.name} 
              fill // Use fill for better responsive handling in cards
              sizes="(max-width: 768px) 100vw, 250px"
              className="object-cover group-hover:scale-105 transition-transform duration-300 bg-amber-200 dark:bg-base-100" 
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-3">
          <p className="font-bold group-hover:text-primary transition-colors">{product.name}</p>
          <p className="text-sm text-gray-500">{product.category}</p>
          <p className="font-medium"><span>₦</span>{product.price}</p>
        </div>
      </div>
    </Link>
  );
}