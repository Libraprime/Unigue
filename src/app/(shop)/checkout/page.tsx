import type { Metadata } from "next";
import RequireAuth from "@/components/RequireAuth";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Checkout" };

// Guarded commit point (ADR 0006). The page body is a Phase 7 placeholder.
export default function CheckoutPage() {
  return (
    <RequireAuth>
      <ComingSoon title="Checkout">Checkout is not available yet. Your bag is saved and will be waiting when it is.</ComingSoon>
    </RequireAuth>
  );
}
