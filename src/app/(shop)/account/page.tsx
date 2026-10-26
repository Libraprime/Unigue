import type { Metadata } from "next";
import RequireAuth from "@/components/RequireAuth";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Account" };

// Guarded commit point (ADR 0006). The page body is a Phase 7 placeholder.
export default function AccountPage() {
  return (
    <RequireAuth>
      <ComingSoon title="Account">Account settings are not available yet.</ComingSoon>
    </RequireAuth>
  );
}
