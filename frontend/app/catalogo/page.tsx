import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { ProductGridSkeleton } from "@/design-system";

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 pt-2">
          <ProductGridSkeleton count={6} />
        </div>
      }
    >
      <CatalogView />
    </Suspense>
  );
}
