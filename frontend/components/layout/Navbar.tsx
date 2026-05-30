"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { useAppStore } from "@/store/useAppStore";
import { useCartStore } from "@/store/useCartStore";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils/cn";

export function Navbar() {
  const { isMenuOpen, toggleMenu, setSearchOpen, openCart } = useAppStore();
  const itemCount = useCartStore((s) => s.itemCount);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 safe-top",
          "border-b border-maia-text/[0.06] bg-white/85 backdrop-blur-2xl backdrop-saturate-150"
        )}
      >
        <div className="app-container">
          <nav
            className="relative mx-auto flex h-nav-height w-full max-w-app-wide items-center justify-between px-4 sm:px-6 lg:max-w-none lg:px-8"
            aria-label="Navegação principal"
          >
            <button
              type="button"
              onClick={toggleMenu}
              className={cn(
                "touch-target flex shrink-0 items-center justify-center rounded-full transition-colors",
                "text-maia-text active:bg-maia-nude/80",
                isMenuOpen && "bg-maia-nude/60"
              )}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="h-[22px] w-[22px]" strokeWidth={1.75} />
              ) : (
                <Menu className="h-[22px] w-[22px]" strokeWidth={1.75} />
              )}
            </button>

            <Link
              href={ROUTES.home}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <span className="font-display text-[1.15rem] font-bold tracking-tight text-maia-text">
                Le <span className="text-maia-orange">Maia</span>
              </span>
            </Link>

            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="touch-target flex items-center justify-center rounded-full text-maia-text transition-colors active:bg-maia-nude/80"
                aria-label="Buscar"
              >
                <Search className="h-[22px] w-[22px]" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={openCart}
                className="touch-target relative flex items-center justify-center rounded-full text-maia-text transition-colors active:bg-maia-nude/80 lg:hidden"
                aria-label={`Carrinho${itemCount > 0 ? `, ${itemCount} itens` : ""}`}
              >
                <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.75} />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-maia-orange px-1 text-[10px] font-bold leading-none text-white shadow-sm"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </button>
              <Link
                href={ROUTES.cart}
                className="touch-target relative hidden items-center justify-center rounded-full text-maia-text transition-colors hover:bg-maia-nude/60 lg:flex"
                aria-label={`Carrinho${itemCount > 0 ? `, ${itemCount} itens` : ""}`}
              >
                <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.75} />
                {itemCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-maia-orange px-1 text-[10px] font-bold leading-none text-white shadow-sm">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <MobileMenu />
    </>
  );
}
