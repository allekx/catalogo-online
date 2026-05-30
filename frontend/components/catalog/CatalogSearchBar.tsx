"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface CatalogSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CatalogSearchBar({
  value,
  onChange,
  className,
}: CatalogSearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-maia-light"
        strokeWidth={1.75}
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar nome, categoria ou tipo..."
        enterKeyHint="search"
        autoComplete="off"
        className={cn(
          "w-full min-h-[48px] rounded-2xl border border-maia-text/[0.08] bg-white py-3 pl-10 pr-10",
          "font-body text-base text-maia-text placeholder:text-maia-light sm:text-sm",
          "shadow-sm outline-none transition-shadow touch-manipulation",
          "focus:border-maia-orange/40 focus:ring-2 focus:ring-maia-orange/15"
        )}
        aria-label="Buscar produtos"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-maia-muted transition-colors active:bg-maia-nude"
          aria-label="Limpar busca"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}
