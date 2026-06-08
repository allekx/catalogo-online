"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { isLogoUrl, shouldOptimizeBioLogo } from "@/lib/bio-view";
import type { BioViewModel } from "@/types/bio";
import { useBioMotion } from "./bio-motion";

type BioHeroProps = {
  hero: BioViewModel["hero"];
};

export function BioHero({ hero }: BioHeroProps) {
  const m = useBioMotion();
  const showLogoImage = isLogoUrl(hero.logo);
  const optimizeLogo = shouldOptimizeBioLogo(hero.logo);

  return (
    <motion.header
      variants={m.variants.hero}
      initial={m.initial}
      animate={m.animate}
      className="px-1 pb-1 pt-2 text-center sm:px-2"
      aria-label={`Apresentação ${hero.companyName}`}
    >
      <div className="flex flex-col items-center">
        <motion.div variants={m.variants.heroLogo} className="relative">
          <motion.div
            className="relative flex h-[7.25rem] w-[7.25rem] items-center justify-center overflow-hidden rounded-full bg-[var(--bio-primary)] shadow-[0_16px_44px_color-mix(in_srgb,var(--bio-primary)_38%,transparent)] ring-[3px] ring-white/90 sm:h-[7.75rem] sm:w-[7.75rem]"
            role="img"
            aria-label={`Logo ${hero.companyName}`}
            {...m.hover.icon}
          >
            {showLogoImage ? optimizeLogo ? (
              <Image
                src={hero.logo}
                alt=""
                fill
                className="object-cover"
                sizes="124px"
                priority
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hero.logo}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-display text-[1.85rem] font-bold leading-none tracking-tight text-white sm:text-[2rem]">
                {hero.logoMonogram}
              </span>
            )}
          </motion.div>
        </motion.div>

        <motion.h1
          variants={m.variants.heroLine}
          className="mt-6 font-display text-[1.625rem] font-bold leading-tight tracking-tight text-[var(--bio-text,#222)] sm:text-[1.75rem]"
        >
          {hero.companyName}
        </motion.h1>

        <motion.p
          variants={m.variants.heroLine}
          className="mt-2 max-w-[18rem] font-display text-[0.9375rem] font-medium leading-snug text-[var(--bio-text-muted,#666)] sm:max-w-xs sm:text-base"
        >
          {hero.description}
        </motion.p>

        <motion.p
          variants={m.variants.heroLine}
          className="mt-1.5 max-w-[17.5rem] font-body text-[0.9375rem] leading-relaxed text-[var(--bio-text-muted,#666)] sm:max-w-xs"
        >
          {hero.accentLine.includes("amor") ? (
            <>
              Feitas com{" "}
              <span className="font-semibold text-[var(--bio-primary)]">
                amor
              </span>{" "}
              para você!
            </>
          ) : (
            hero.accentLine
          )}
        </motion.p>

        <motion.div variants={m.variants.heroLine} className="mt-4">
          <motion.span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bio-primary)]/[0.07]"
            {...m.hover.icon}
          >
            <Heart
              className="h-3.5 w-3.5 fill-[var(--bio-primary)]/20 text-[var(--bio-primary)]"
              strokeWidth={1.75}
              aria-hidden
            />
          </motion.span>
        </motion.div>
      </div>
    </motion.header>
  );
}
