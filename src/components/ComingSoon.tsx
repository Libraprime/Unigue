import Link from "next/link";

/**
 * Honest placeholder for the signed-in pages whose real UI is Phase 7
 * (docs/REDESIGN_PLAN.md). The auth guard around it is real and final; only
 * this body gets replaced.
 */
export default function ComingSoon({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-3 text-base-content/70">{children ?? "This page isn't available yet."}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/bag" className="btn btn-outline">Back to bag</Link>
        <Link href="/#shop" className="btn btn-primary">Continue shopping</Link>
      </div>
    </div>
  );
}
