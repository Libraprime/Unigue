import { redirect } from "next/navigation";

// The storefront now lives at `/` (Phase 2). `/dashboard` is kept only so old
// bookmarks and links keep working.
export default function DashboardRedirect() {
  redirect("/");
}
