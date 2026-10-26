import type { Metadata } from "next";
import Favorites from "@/components/Favorites";

export const metadata: Metadata = { title: "Favourites" };

export default function FavoritesPage() {
  return <Favorites />;
}
