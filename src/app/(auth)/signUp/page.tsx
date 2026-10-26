import type { Metadata } from "next";
import Register from "./register";
import { safeReturnTo } from "@/components/lib/returnTo";

export const metadata: Metadata = { title: "Create account" };

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const { returnTo } = await searchParams;
  return <Register returnTo={safeReturnTo(returnTo)} />;
}
