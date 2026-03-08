// src/app/@modal/(.)products/[id]/page.tsx
"use client";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/components/lib/product"; // Import your shared data

export default function ProductModal({ params }: { params: { id: string } }) {
  const router = useRouter();
  const product = PRODUCTS.find((p) => p.id === parseInt(params.id));

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-lg relative dark:bg-gray-800">
        <button 
          onClick={() => router.back()} 
          className="absolute top-2 right-2 btn btn-circle btn-sm"
        >✕</button>
        
        <img src={product.image} alt={product.name} className="w-full rounded" />
        <h2 className="text-2xl font-bold mt-4">{product.name}</h2>
        <p className="">{product.category} - ₦{product.price}</p>
      </div>
    </div>
  );
}