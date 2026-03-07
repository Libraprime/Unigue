// src/app/product/[id]/page.js
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/components/lib/firebase"; // Your firebase init file

export default async function ProductPage({ params }: { params: { id: string } }) {
  // 1. Grab the ID from the URL
  const { id } = params;

  // 2. Fetch data from Firestore
  const docRef = doc(db, "products", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return <div>Product not found</div>;

  const product = snapshot.data();

  return (
    <div className="container mx-auto p-5 md:flex gap-10">
      {/* Product Images Section */}
      <div className="md:w-1/2">
        <img src={product.images[0]} className="rounded-2xl w-full" alt={product.name} />
      </div>

      {/* Product Details Section */}
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold">₦{product.price}</p>
        <p className="text-gray-600">{product.description}</p>
        
        {/* Actions */}
        <div className="flex gap-4">
          <button className="btn btn-primary flex-1">Add to Cart</button>
          <button className="btn btn-outline">Buy Now</button>
        </div>
      </div>
    </div>
  );
}