"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { HOME_BANNERS } from "@/lib/data/home";
import { useAutoSlider } from "@/hooks/useAutoSlider";
import { cn } from "@/lib/utils/cn";

export function HomeBannerSlider() {
  const { index, goTo, setPaused } = useAutoSlider(HOME_BANNERS.length, 4500);
  const slide = HOME_BANNERS[index];

  return (
    <section
      className="relative -mx-4 px-4 sm:-mx-6 sm:px-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Destaques"
    >
      <div className="relative overflow-hidden rounded-[1.35rem] shadow-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "relative flex min-h-[168px] flex-col justify-between bg-gradient-to-br p-5 sm:min-h-[180px]",
              slide.gradient
            )}
          >
            {/* Decoração premium */}
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40"
              style={{ background: slide.accent }}
            />
            <div className="pointer-events-none absolute -bottom-6 right-12 h-20 w-20 rounded-full bg-white/30" />

            <div className="relative z-10">
              <span className="inline-block rounded-full bg-white/70 px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-wider text-maia-orange backdrop-blur-sm">
                Le Maia
              </span>
              <h2 className="mt-2 font-display text-xl font-bold leading-tight text-maia-text sm:text-2xl">
                {slide.title}
              </h2>
              <p className="mt-1 max-w-[220px] font-body text-xs leading-relaxed text-maia-muted sm:text-sm">
                {slide.subtitle}
              </p>
            </div>

            <Link
              href={slide.href}
              className="relative z-10 mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-maia-orange px-4 py-2.5 font-display text-xs font-semibold text-white shadow-float transition-transform active:scale-[0.97]"
            >
              {slide.cta}
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Indicadores */}
        <div className="absolute bottom-3 right-4 z-20 flex gap-1.5">
          {HOME_BANNERS.map((b, i) => (
            <button
              key={b.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index
                  ? "w-5 bg-maia-orange"
                  : "w-1.5 bg-maia-text/20 hover:bg-maia-text/35"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
