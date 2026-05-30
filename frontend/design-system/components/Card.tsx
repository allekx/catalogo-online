"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils/cn";
import { slideUp, duration, easePremium } from "../motion/config";

export type CardVariant = "default" | "elevated" | "outline" | "flat";

interface CardProps {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  animate?: boolean;
  className?: string;
  children?: ReactNode;
  id?: string;
}

const cardVariants: Record<CardVariant, string> = {
  default: "bg-white shadow-card rounded-3xl",
  elevated: "bg-white shadow-lg rounded-3xl",
  outline: "bg-white border border-maia-rose/40 rounded-3xl",
  flat: "bg-maia-nude/40 rounded-3xl",
};

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  variant = "default",
  padding = "md",
  animate = false,
  className,
  children,
  id,
}: CardProps) {
  const reduced = usePrefersReducedMotion();
  const classNames = cn(
    "overflow-hidden",
    cardVariants[variant],
    paddings[padding],
    className
  );

  if (animate && !reduced) {
    return (
      <motion.div
        id={id}
        variants={slideUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-24px" }}
        transition={{ duration: duration.base, ease: easePremium }}
        className={classNames}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div id={id} className={classNames}>
      {children}
    </div>
  );
}
