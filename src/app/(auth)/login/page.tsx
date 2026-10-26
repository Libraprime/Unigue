import type { Metadata } from "next";
import Login from "./login";
import { safeReturnTo } from "@/components/lib/returnTo";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const { returnTo } = await searchParams;
  return <Login returnTo={safeReturnTo(returnTo)} />;
}
