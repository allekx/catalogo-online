"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils/cn";
import { hoverLift } from "./config";

interface MotionHoverProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

/** Elevação suave no hover (desktop) */
export function MotionHover({
  children,
  className,
  disabled = false,
}: MotionHoverProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced || disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      variants={hoverLift}
      className={cn("rounded-3xl", className)}
    >
      {children}
    </motion.div>
  );
}
