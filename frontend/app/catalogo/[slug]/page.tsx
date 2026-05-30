import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { buildProductMetadata } from "@/lib/metadata";
import {
  fetchProductCached,
  fetchRelatedProductsCached,
} from "@/lib/products/fetch-server";
import {
  BreadcrumbJsonLd,
  ProductJsonLd,
} from "@/lib/seo/structured-data";
import { ROUTES } from "@/lib/constants/routes";

interface ProductPageProps {
  params: { slug: string };
}

export const revalidate = 120;

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await fetchProductCached(params.slug);
  if (!product) return { title: "Produto não encontrado" };
  return buildProductMetadata(product);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProductCached(params.slug);

  if (!product) {
    notFound();
  }

  const related = await fetchRelatedProductsCached(params.slug, 4);

  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { name: "Início", path: ROUTES.home },
          { name: "Catálogo", path: ROUTES.catalog },
          { name: product.name, path: ROUTES.product(product.slug) },
        ]}
      />
      <ProductDetail product={product} related={related} />
    </>
  );
}
