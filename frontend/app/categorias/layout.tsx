import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = buildPageMetadata({
  title: "Categorias",
  description:
    "Explore bolsas, clutches, totes, maternidade e kits por categoria.",
  path: ROUTES.categories,
});

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
