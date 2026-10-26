import { Suspense } from "react";
import BrandStrip from "./BrandStrip";
import NewArrivals from "./NewArrivals";
import Features from "./Features";
import PopularGrid from "./PopularGrid";
import Newsletter from "./Newsletter";
import { getProducts } from "../lib/product";

/** Home page sections below the hero, in the order the reference screen shows them. */
export default function Main_body() {
  const newArrivals = getProducts().filter((p) => p.isNew);
  return (
    <>
      <BrandStrip />
      <NewArrivals products={newArrivals} />
      <Features />
      {/* useSearchParams() inside PopularGrid requires a Suspense boundary. */}
      <Suspense fallback={<div className="h-96" aria-hidden="true" />}>
        <PopularGrid />
      </Suspense>
      <Newsletter />
    </>
  );
}
