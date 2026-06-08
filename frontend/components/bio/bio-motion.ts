"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  duration,
  easePremium,
  fadeIn,
  scaleIn,
  slideUpSubtle,
  springSoft,
  staggerContainer,
} from "@/design-system/motion/config";
import type { Variants } from "framer-motion";

export const bioMotion = {
  page: staggerContainer(0.09, 0.05),
  section: slideUpSubtle,
  hero: staggerContainer(0.065, 0.05),
  heroLogo: scaleIn,
  heroLine: slideUpSubtle,
  links: staggerContainer(0.055, 0),
  linkItem: slideUpSubtle,
  galleryRow: staggerContainer(0.045, 0.08),
  galleryThumb: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: duration.fast, ease: easePremium },
    },
  } satisfies Variants,
  social: staggerContainer(0.07, 0.06),
  socialBtn: {
    hidden: { opacity: 0, scale: 0.92, y: 8 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: springSoft,
    },
  } satisfies Variants,
  fade: fadeIn,
} as const;

export function useBioMotion() {
  const reduced = usePrefersReducedMotion();
  const state = reduced
    ? ({ initial: false, animate: false } as const)
    : ({ initial: "hidden" as const, animate: "visible" as const });

  return {
    ...state,
    reduced,
    variants: bioMotion,
    hover: {
      primary: reduced
        ? {}
        : {
            whileHover: { scale: 1.008, transition: { duration: 0.2 } },
            whileTap: { scale: 0.98 },
          },
      card: reduced
        ? {}
        : {
            whileHover: { y: -1, scale: 1.006, transition: { duration: 0.22 } },
            whileTap: { scale: 0.985 },
          },
      icon: reduced
        ? {}
        : {
            whileHover: { scale: 1.05, y: -2, transition: springSoft },
            whileTap: { scale: 0.94, y: 0 },
          },
      image: reduced
        ? {}
        : { whileTap: { scale: 1.04, transition: { duration: 0.18 } } },
    },
  };
}
