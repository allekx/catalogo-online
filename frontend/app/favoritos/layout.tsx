import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = buildPageMetadata({
  title: "Favoritos",
  description: "Suas bolsas favoritas Le Maia — salvas neste dispositivo.",
  path: ROUTES.favorites,
  noIndex: true,
});

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
