"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils/cn";
import { skeletonShimmer } from "../motion/config";
import { StaggerItem, StaggerReveal } from "../motion/StaggerReveal";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
}

const variants = {
  text: "h-4 w-full rounded-lg",
  circular: "rounded-full",
  rectangular: "rounded-2xl",
  card: "rounded-3xl aspect-[4/5]",
};

function ShimmerBlock({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div
        className={cn(
          "animate-pulse bg-maia-nude/70",
          className
        )}
        aria-hidden
      />
    );
  }

  return (
    <motion.div
      className={cn(
        "bg-gradient-to-r from-maia-nude/50 via-maia-rose/55 to-maia-nude/50 bg-[length:200%_100%]",
        className
      )}
      animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
      transition={skeletonShimmer}
      aria-hidden
    />
  );
}

export function Skeleton({ className, variant = "rectangular" }: SkeletonProps) {
  return <ShimmerBlock className={cn(variants[variant], className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-card">
      <ShimmerBlock className="aspect-[4/5] w-full rounded-none" />
      <div className="space-y-2.5 p-4">
        <ShimmerBlock className="h-3 w-3/4 rounded-lg" />
        <ShimmerBlock className="h-4 w-1/2 rounded-lg" />
        <ShimmerBlock className="mt-3 h-11 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <StaggerReveal stagger={0.05} className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <StaggerItem key={i}>
          <ProductCardSkeleton />
        </StaggerItem>
      ))}
    </StaggerReveal>
  );
}
