"use client";

import Link from "next/link";
import { MotionPress, StaggerReveal, StaggerItem } from "@/design-system/motion";
import { ROUTES } from "@/lib/constants/routes";
import { HOME_CATEGORIES } from "@/lib/data/home";
import { cn } from "@/lib/utils/cn";

export function HomeCategoriesScroll() {
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

      <div className="scroll-touch-x -mx-4 px-4 pb-1 snap-x snap-mandatory sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        <StaggerReveal stagger={0.04} className="flex gap-4">
          {HOME_CATEGORIES.map((cat) => (
            <StaggerItem key={cat.slug} className="snap-start shrink-0">
              <MotionPress as="span" hover>
                <Link
                  href={`${ROUTES.catalog}?categoria=${cat.slug}`}
                  className="group flex w-[4.5rem] flex-col items-center gap-2 sm:w-[5rem]"
                >
                  <span
                    className={cn(
                      "flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full text-2xl shadow-sm",
                      "ring-1 ring-maia-text/[0.04] transition-transform duration-300",
                      "group-active:scale-95 group-hover:scale-105 sm:h-[4.75rem] sm:w-[4.75rem]"
                    )}
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.icon}
                  </span>
                  <span className="max-w-[4.5rem] truncate text-center font-display text-[11px] font-medium text-maia-text">
                    {cat.name}
                  </span>
                </Link>
              </MotionPress>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
