"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { PUBLIC_BOTTOM_NAV } from "@/lib/constants/navigation";
import { useFavoriteCount } from "@/store/useFavoritesStore";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils/cn";

export function BottomNavigation() {
  const pathname = usePathname();
  const favoriteCount = useFavoriteCount();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <nav className="bottom-nav-shell" aria-label="Navegação do catálogo">
      <div className="app-container">
        <div className="bottom-nav-inner mx-auto w-full max-w-app-wide lg:max-w-app">
          <ul className="flex h-[var(--bottom-nav-height)] items-stretch justify-around px-0.5">
            {PUBLIC_BOTTOM_NAV.map(({ href, label, icon: Icon, exact, badge }) => {
              const isActive = exact
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);

              const showBadge =
                badge === "favorites" && favoriteCount > 0;

              return (
                <li key={href} className="flex min-w-0 flex-1">
                  <Link
                    href={href}
                    className={cn(
                      "bottom-nav-item",
                      isActive ? "text-maia-orange" : "text-maia-light"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive && !reducedMotion && (
                      <motion.span
                        layoutId="bottom-nav-pill"
                        className="absolute inset-x-0.5 top-1 bottom-1 rounded-2xl bg-maia-orange/[0.08]"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 32,
                        }}
                      />
                    )}
                    {isActive && reducedMotion && (
                      <span className="absolute inset-x-0.5 top-1 bottom-1 rounded-2xl bg-maia-orange/[0.08]" />
                    )}
                    <span className="relative z-10 flex flex-col items-center gap-0.5">
                      <span className="relative">
                        <Icon
                          className="h-6 w-6"
                          strokeWidth={isActive ? 2.25 : 1.75}
                        />
                        {showBadge && (
                          <span className="absolute -right-2 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-maia-orange px-1 text-[10px] font-bold leading-none text-white">
                            {favoriteCount > 9 ? "9+" : favoriteCount}
                          </span>
                        )}
                      </span>
                      <span
                        className={cn(
                          "max-w-full truncate font-display text-[10px] font-medium leading-tight xs:text-[11px]",
                          isActive && "font-semibold"
                        )}
                      >
                        {label}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
