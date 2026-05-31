import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { buildPageMetadata } from "@/lib/metadata";
import { fetchFeaturedProducts } from "@/lib/products/fetch-server";
import { ROUTES } from "@/lib/constants/routes";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Início",
  description:
    "Catálogo premium Le Maia — bolsas, kits, maternidade e peças personalizadas com artesanato exclusivo.",
  path: ROUTES.home,
});

export default async function Page() {
  const featuredProducts = await fetchFeaturedProducts(6);

  return <HomePage featuredProducts={featuredProducts} />;
}
