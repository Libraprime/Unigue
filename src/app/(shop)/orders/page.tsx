import type { Metadata } from "next";
import RequireAuth from "@/components/RequireAuth";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Orders" };

// Guarded commit point (ADR 0006). The page body is a Phase 7 placeholder.
export default function OrdersPage() {
  return (
    <RequireAuth>
      <ComingSoon title="Orders">Your order history will appear here once checkout is live.</ComingSoon>
    </RequireAuth>
  );
}
