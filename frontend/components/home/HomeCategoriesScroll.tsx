"use client";

import Link from "next/link";
import { CategoryThumbnail } from "@/components/catalog/CategoryThumbnail";
import { MotionPress } from "@/design-system/motion";
import { useCatalogCategories } from "@/hooks/useCatalogCategories";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

export function HomeCategoriesScroll() {
  const { categories, loading } = useCatalogCategories();

  return (
    <section className="mt-7" aria-labelledby="home-categories-title">
      <div className="mb-4 flex items-end justify-between px-0.5">
        <h2
          id="home-categories-title"
          className="font-display text-lg font-semibold text-maia-text"
        >
          Categorias
        </h2>
        <Link
          href={ROUTES.categories}
          className="font-display text-xs font-medium text-maia-orange active:opacity-70"
        >
          Ver todas
        </Link>
      </div>

      {loading ? (
        <div className="flex gap-4 px-0.5" aria-hidden>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[4.75rem] w-[4.5rem] shrink-0 animate-pulse rounded-full bg-maia-nude/80 sm:w-[5rem]"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="rounded-2xl bg-maia-nude/40 px-4 py-6 text-center font-body text-sm text-maia-muted">
          Nenhuma categoria ativa no catálogo ainda.
        </p>
      ) : (
        <div className="scroll-touch-x -mx-4 px-4 pb-1 snap-x snap-mandatory sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <ul className="m-0 flex list-none gap-4 p-0" role="list">
            {categories.map((cat) => (
              <li key={cat.slug} className="snap-start shrink-0 list-none">
                <MotionPress as="span" hover>
                  <Link
                    href={`${ROUTES.catalog}?categoria=${encodeURIComponent(cat.slug)}`}
                    className="group flex w-[4.5rem] flex-col items-center gap-2 sm:w-[5rem]"
                  >
                    <CategoryThumbnail
                      name={cat.name}
                      imageUrl={cat.imageUrl}
                      className={cn(
                        "transition-transform duration-300",
                        "group-active:scale-95 group-hover:scale-105"
                      )}
                    />
                    <span className="max-w-[4.5rem] truncate text-center font-display text-[11px] font-medium text-maia-text">
                      {cat.name}
                    </span>
                  </Link>
                </MotionPress>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
