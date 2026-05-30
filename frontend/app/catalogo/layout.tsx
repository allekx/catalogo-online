import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = buildPageMetadata({
  title: "Catálogo",
  description:
    "Explore bolsas, clutches, totes e kits personalizados Le Maia. Filtros, busca e compra rápida.",
  path: ROUTES.catalog,
});

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
