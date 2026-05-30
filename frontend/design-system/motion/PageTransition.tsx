"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { pageTransition } from "./config";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/** Transição suave entre rotas (usar em app/template.tsx) */
export function PageTransition({ children, className }: PageTransitionProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      transition={pageTransition.transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
