"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { PUBLIC_DESKTOP_NAV } from "@/lib/constants/navigation";
import { useFavoriteCount } from "@/store/useFavoritesStore";
import { useCartStore } from "@/store/useCartStore";
import { cn } from "@/lib/utils/cn";

export function DesktopNav() {
  const pathname = usePathname();
  const favoriteCount = useFavoriteCount();
  const itemCount = useCartStore((s) => s.itemCount);

  return (
    <aside
      className="sticky top-0 hidden h-dvh w-[var(--sidebar-width,15rem)] shrink-0 flex-col border-r border-maia-text/[0.06] bg-white/80 backdrop-blur-xl lg:flex"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
      aria-label="Navegação do catálogo"
    >
      <div className="px-5 py-6">
        <Link href={ROUTES.home} className="font-display text-xl font-bold">
          Le <span className="text-maia-orange">Maia</span>
        </Link>
        <p className="mt-1 text-xs text-maia-muted">Vitrine digital</p>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {PUBLIC_DESKTOP_NAV.map(({ href, label, icon: Icon, exact, badge }) => {
          const isActive = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          const badgeCount =
            badge === "favorites" && favoriteCount > 0
              ? favoriteCount
              : badge === "cart" && itemCount > 0
                ? itemCount
                : null;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-maia-orange text-white shadow-sm"
                  : "text-maia-text hover:bg-maia-nude/70"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2.25 : 1.75} />
              <span className="flex-1">{label}</span>
              {badgeCount != null && (
                <span
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                    isActive ? "bg-white/25 text-white" : "bg-maia-orange text-white"
                  )}
                >
                  {Number(badgeCount) > 9 ? "9+" : badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-maia-text/[0.06] p-4">
        <p className="font-body text-[11px] leading-relaxed text-maia-muted">
          Pedidos finalizados pelo WhatsApp. Sem cadastro ou pagamento no site.
        </p>
        <Link
          href={ROUTES.cart}
          className="mt-3 flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-maia-nude/60 font-display text-sm font-medium text-maia-text"
        >
          <ShoppingBag className="h-4 w-4" />
          Ver carrinho
        </Link>
      </div>
    </aside>
  );
}
