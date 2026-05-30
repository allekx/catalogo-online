import { absoluteUrl } from "./metadata";
import { SITE_NAME, SITE_URL } from "./config";
import type { Product } from "@/lib/products/types";
import { getProductImageUrl } from "@/lib/cloudinary";
import { ROUTES } from "@/lib/constants/routes";

function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "Catálogo premium de bolsas personalizadas femininas.",
        sameAs: process.env.NEXT_PUBLIC_INSTAGRAM_URL
          ? [process.env.NEXT_PUBLIC_INSTAGRAM_URL]
          : undefined,
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: absoluteUrl(`${ROUTES.catalog}?busca={search_term_string}`),
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  const image = getProductImageUrl(
    product.imageUrl,
    product.cloudinaryPublicId,
    "og"
  );

  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: [image],
        sku: product.id,
        brand: { "@type": "Brand", name: SITE_NAME },
        offers: {
          "@type": "Offer",
          url: absoluteUrl(ROUTES.product(product.slug)),
          priceCurrency: "BRL",
          price: product.price,
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
        ...(product.category
          ? { category: product.category.name }
          : {}),
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: absoluteUrl(item.path),
        })),
      }}
    />
  );
}
