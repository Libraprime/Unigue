import type { Metadata } from "next";
import Bag from "@/components/Bag";

export const metadata: Metadata = { title: "Your bag" };

// Guests can fill a bag (ADR 0002); signing in is required at /checkout (ADR 0006).
export default function BagPage() {
  return <Bag />;
}
