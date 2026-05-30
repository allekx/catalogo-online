"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils/cn";
import {
  fadeIn,
  slideUp,
  slideUpSubtle,
  scaleIn,
  duration,
  easePremium,
} from "../motion/config";

type RevealVariant = "fade" | "slideUp" | "slideUpSubtle" | "scale";

interface ScrollRevealProps {
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  children?: ReactNode;
  once?: boolean;
}

const variantMap = {
  fade: fadeIn,
  slideUp,
  slideUpSubtle,
  scale: scaleIn,
};

export function ScrollReveal({
  variant = "slideUp",
  delay = 0,
  className,
  children,
  once = true,
}: ScrollRevealProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px", amount: 0.15 }}
      variants={variantMap[variant]}
      transition={{ delay, duration: duration.base, ease: easePremium }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
