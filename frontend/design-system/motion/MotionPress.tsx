"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils/cn";
import { press, springPress } from "./config";

type MotionPressProps = {
  as?: "div" | "span" | "button";
  hover?: boolean;
  children?: ReactNode;
  className?: string;
  transition?: typeof springPress;
};

/** Escala suave ao tocar (press) — ideal para chips e cards clicáveis */
export function MotionPress({
  as = "div",
  hover = false,
  children,
  className,
  transition = springPress,
}: MotionPressProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    const Tag = as === "span" ? "span" : as === "button" ? "button" : "div";
    return <Tag className={className}>{children}</Tag>;
  }

  const Component =
    as === "button" ? motion.button : as === "span" ? motion.span : motion.div;

  return (
    <Component
      type={as === "button" ? "button" : undefined}
      whileTap={press.tap}
      whileHover={hover ? press.hover : undefined}
      transition={transition}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
