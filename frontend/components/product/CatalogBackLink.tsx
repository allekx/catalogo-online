"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

interface CatalogBackLinkProps {
  className?: string;
  label?: string;
}

export function CatalogBackLink({
  className,
  label = "Voltar ao catálogo",
}: CatalogBackLinkProps) {
  return (
    <Link
      href={ROUTES.catalog}
      className={cn(
        "group mb-4 inline-flex min-h-[44px] max-w-full items-center gap-2.5 rounded-2xl",
        "border border-maia-rose/45 bg-white/95 px-2.5 py-2 pr-4 shadow-sm backdrop-blur-sm",
        "transition-all duration-200",
        "hover:border-maia-orange/35 hover:bg-maia-nude/50 hover:shadow-card",
        "active:scale-[0.98]",
        className
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
          "bg-maia-nude/80 text-maia-orange transition-colors duration-200",
          "group-hover:bg-maia-orange/12"
        )}
        aria-hidden
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
      </span>
      <span className="font-display text-[13px] font-medium leading-snug text-maia-text transition-colors duration-200 group-hover:text-maia-orange">
        {label}
      </span>
    </Link>
  );
}
