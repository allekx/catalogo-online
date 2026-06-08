"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { BioLinkKey } from "@/types/bio";
import { cn } from "@/lib/utils/cn";
import { BioLinkIcon } from "./BioLinkIcon";
import { useBioMotion } from "./bio-motion";

export type BioLinkCardProps = {
  linkId: BioLinkKey;
  title: string;
  description: string;
  href: string;
  external?: boolean;
  className?: string;
};

export function BioLinkCard({
  linkId,
  title,
  description,
  href,
  external = false,
  className,
}: BioLinkCardProps) {
  const m = useBioMotion();

  const inner = (
    <>
      <span className="bio-icon-chip transition-transform duration-200 group-hover:scale-[1.03]">
        <BioLinkIcon id={linkId} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center text-left">
        <span className="font-display text-[15px] font-semibold leading-tight text-[var(--bio-text,#222)]">
          {title}
        </span>
        <span className="mt-0.5 font-body text-[11px] leading-snug text-[var(--bio-text-muted,#666)] sm:text-xs">
          {description}
        </span>
      </span>
      <ChevronRight
        className="h-[1.15rem] w-[1.15rem] shrink-0 self-center text-[var(--bio-primary)]/75 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--bio-primary)]"
        strokeWidth={1.5}
        aria-hidden
      />
    </>
  );

  const cardClass = cn(
    "group bio-card-surface flex min-h-[4.25rem] w-full items-center gap-3 px-4 py-3.5",
    "border border-[var(--bio-primary)]/[0.05]",
    "transition-[box-shadow,border-color] duration-200",
    "hover:border-[var(--bio-primary)]/14 hover:shadow-[0_12px_28px_-10px_rgba(34,34,34,0.08)]",
    "active:scale-[0.995]",
    className
  );

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
        {...m.hover.card}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.div {...m.hover.card}>
      <Link href={href} className={cardClass}>
        {inner}
      </Link>
    </motion.div>
  );
}
