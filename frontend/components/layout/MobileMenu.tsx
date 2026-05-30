"use client";

import { useEffect, useCallback } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ExternalLink } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { MOBILE_MENU_SECTIONS, type MenuItem } from "@/lib/constants/menu";
import { buildGreetingMessage, openWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils/cn";
import { easings } from "@/design-system/tokens/animations";

const panelVariants = {
  closed: { x: "-100%" },
  open: { x: 0 },
};

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const listVariants = {
  open: {
    transition: { staggerChildren: 0.04, delayChildren: 0.08 },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: -16 },
  open: { opacity: 1, x: 0 },
};

function isActivePath(pathname: string, href: string): boolean {
  if (href.startsWith("http")) return false;
  const path = href.split("?")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function MenuLink({
  item,
  isActive,
  onNavigate,
}: {
  item: MenuItem;
  isActive: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  const isExternal = item.type === "external";

  function renderIcon() {
    if (item.id === "instagram") return <InstagramIcon />;
    return <Icon className="h-[18px] w-[18px]" strokeWidth={1.85} />;
  }

  const accentStyles = {
    whatsapp: "bg-[#25D366]/10 text-[#25D366]",
    instagram:
      "bg-gradient-to-br from-[#F58529]/15 via-[#DD2A7B]/15 to-[#8134AF]/15 text-[#DD2A7B]",
  };

  const content = (
    <>
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
          item.accent
            ? accentStyles[item.accent]
            : isActive
              ? "bg-maia-orange/12 text-maia-orange"
              : "bg-maia-nude/60 text-maia-muted"
        )}
      >
        {renderIcon()}
      </span>
      <span className="flex-1 font-display text-[15px] font-medium text-maia-text">
        {item.label}
      </span>
      {isExternal ? (
        <ExternalLink className="h-4 w-4 text-maia-light" strokeWidth={1.75} />
      ) : (
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-colors",
            isActive ? "text-maia-orange" : "text-maia-light/80"
          )}
          strokeWidth={1.75}
        />
      )}
    </>
  );

  const className = cn(
    "group flex w-full items-center gap-3 rounded-2xl px-3 py-3 transition-colors",
    "active:bg-maia-nude/80",
    isActive && !item.accent && "bg-maia-nude/50"
  );

  if (isExternal) {
    const handleExternal = () => {
      if (item.id === "whatsapp") {
        openWhatsApp(buildGreetingMessage());
      } else {
        window.open(item.href, "_blank", "noopener,noreferrer");
      }
      onNavigate();
    };

    return (
      <motion.li variants={itemVariants}>
        <button type="button" onClick={handleExternal} className={className}>
          {content}
        </button>
      </motion.li>
    );
  }

  return (
    <motion.li variants={itemVariants}>
      <Link href={item.href} onClick={onNavigate} className={className}>
        {content}
      </Link>
    </motion.li>
  );
}

export function MobileMenu() {
  const pathname = usePathname();
  const { isMenuOpen, setMenuOpen } = useAppStore();

  const close = useCallback(() => setMenuOpen(false), [setMenuOpen]);
  useBodyScrollLock(isMenuOpen);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen, close]);

  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <AnimatePresence mode="wait">
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" role="presentation">
          {/* Overlay escuro + blur */}
          <motion.button
            type="button"
            aria-label="Fechar menu"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-maia-text/50 backdrop-blur-md"
            onClick={close}
          />

          {/* Painel lateral */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            id="mobile-menu"
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={easings.softSpring}
            className={cn(
              "absolute left-0 top-0 flex h-full w-[min(88vw,300px)] flex-col",
              "border-r border-white/20 bg-white/95 shadow-nav backdrop-blur-2xl backdrop-saturate-150",
              "safe-top safe-bottom"
            )}
          >
            {/* Header */}
            <div className="flex h-nav-height shrink-0 items-center justify-between border-b border-maia-text/[0.06] px-4">
              <div>
                <p className="font-display text-lg font-bold tracking-tight text-maia-text">
                  Le <span className="text-maia-orange">Maia</span>
                </p>
                <p className="font-body text-[10px] text-maia-light">
                  Catálogo premium
                </p>
              </div>
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={close}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-maia-nude/50 text-maia-text transition-colors hover:bg-maia-nude"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </motion.button>
            </div>

            {/* Links */}
            <nav
              className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 hide-scrollbar"
              aria-label="Menu principal"
            >
              {MOBILE_MENU_SECTIONS.map((section, sectionIndex) => (
                <div
                  key={section.id}
                  className={cn(sectionIndex > 0 && "mt-6")}
                >
                  {section.title && (
                    <p className="mb-2 px-3 font-display text-[10px] font-semibold uppercase tracking-widest text-maia-light">
                      {section.title}
                    </p>
                  )}
                  <motion.ul
                    variants={listVariants}
                    initial="closed"
                    animate="open"
                    className="space-y-0.5"
                  >
                    {section.items.map((item) => (
                      <MenuLink
                        key={item.id}
                        item={item}
                        isActive={isActivePath(pathname, item.href)}
                        onNavigate={close}
                      />
                    ))}
                  </motion.ul>
                </div>
              ))}
            </nav>

            {/* Rodapé */}
            <div className="shrink-0 border-t border-maia-text/[0.06] px-5 py-4">
              <p className="text-center font-body text-[11px] leading-relaxed text-maia-light">
                Bolsas personalizadas com elegância
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
