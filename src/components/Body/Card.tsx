import Image from "next/image";

export default function Card({ product }: { product: { id: number; name: string; category: string; price: string; image: string } }) {
    return (
    <div className="min-w-[250px] snap-center">
      <div className="relative group">
        {/* Action Buttons */}
        <div className="absolute top-0 left-0 w-full h-full z-10">
          <div className="flex justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="btn btn-circle btn-sm">+</button>
            <button className="btn btn-circle btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Image */}
        <div className="rounded-xl overflow-hidden bg-gray-light/20">
          <Image 
            src={product.image} 
            alt={product.name} 
            width={250} 
            height={350}
            className="object-cover hover:scale-105 transition-transform duration-300 bg-amber-200 dark:bg-base-100" 
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-3">
        <p className="font-bold">{product.name}</p>
        <p className="text-sm text-gray">{product.category}</p>
        <p className="font-medium"><span>₦</span>{product.price}</p>
      </div>
    </div>
  );
}