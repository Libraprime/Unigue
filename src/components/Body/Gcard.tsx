

// images should be an array of strings (URLs)
interface Product {
  name: string;
  price: number;
  description: string;
  images: string[];
}

export default function GalleryCard({ product }: { product: Product }) {
  const { name, price, description, images } = product;

  return (
    <div className="card card-sm bg-base-200 max-w-60 shadow-md snap-center min-w-[240px]">
      {/* The Gallery Section */}
      <figure className="hover-gallery h-64 overflow-hidden">
        {images.map((img, index) => (
          <img 
            key={index} 
            src={img} 
            alt={`${name} view ${index + 1}`} 
            className="object-cover w-full h-full"
          />
        ))}
      </figure>

      {/* The Details Section */}
      <div className="card-body p-4">
        <h2 className="card-title flex justify-between text-base">
          {name}
          <span className="font-normal text-sm">₦{price}</span>
        </h2>
        <p className="text-xs opacity-70 line-clamp-2">{description}</p>
        
        <div className="card-actions justify-end mt-2">
           <button className="btn btn-primary btn-xs">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}