"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { BioLinkKey } from "@/types/bio";
import { cn } from "@/lib/utils/cn";
import { BioLinkIcon } from "./BioLinkIcon";
import { useBioMotion } from "./bio-motion";

export type PrimaryLinkCardProps = {
  linkId: BioLinkKey;
  title: string;
  description: string;
  href: string;
  external?: boolean;
  className?: string;
};

export function PrimaryLinkCard({
  linkId,
  title,
  description,
  href,
  external = false,
  className,
}: PrimaryLinkCardProps) {
  const m = useBioMotion();

  const content = (
    <>
      <span className="bio-icon-chip bio-icon-chip--on-cta transition-transform duration-200 group-hover:scale-[1.03]">
        <BioLinkIcon id={linkId} className="text-[var(--bio-primary)]" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block font-display text-[15px] font-semibold leading-tight text-white">
          {title}
        </span>
        <span className="mt-0.5 block font-body text-[11px] leading-snug text-white/88 sm:text-xs">
          {description}
        </span>
      </span>
      <ChevronRight
        className="h-[1.15rem] w-[1.15rem] shrink-0 text-white/90 transition-transform duration-200 group-hover:translate-x-0.5"
        strokeWidth={1.5}
        aria-hidden
      />
    </>
  );

  const cardClass = cn(
    "group bio-card-cta flex min-h-[4.625rem] w-full items-center gap-3 px-4 py-3.5",
    "text-white transition-[filter] duration-200 hover:brightness-[1.02] active:brightness-[0.98]",
    className
  );

  if (external) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
        {...m.hover.primary}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div {...m.hover.primary}>
      <Link href={href} className={cardClass}>
        {content}
      </Link>
    </motion.div>
  );
}
