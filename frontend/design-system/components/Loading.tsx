"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizes = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function Loading({
  size = "md",
  label,
  fullScreen,
  className,
}: LoadingProps) {
  const spinner = (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <motion.div
        className={cn(
          "rounded-full border-2 border-maia-nude border-t-maia-orange",
          sizes[size]
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        role="status"
        aria-label={label ?? "Carregando"}
      />
      {label && (
        <p className="font-body text-sm text-maia-muted">{label}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-1", className)} aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-maia-orange"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1, 0.85] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}
