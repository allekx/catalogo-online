"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import type { BioResolvedSocialItem } from "@/types/bio";
import { cn } from "@/lib/utils/cn";
import { useBioMotion } from "./bio-motion";

export type SocialFooterProps = {
  items: BioResolvedSocialItem[];
  className?: string;
};

function SocialIcon({ id }: { id: BioResolvedSocialItem["id"] }) {
  const cls = "h-[1.15rem] w-[1.15rem] text-[var(--bio-primary)]";
  if (id === "instagram") return <InstagramIcon className={cls} />;
  if (id === "whatsapp") {
    return <MessageCircle className={cls} strokeWidth={1.5} aria-hidden />;
  }
  return <ShoppingBag className={cls} strokeWidth={1.5} aria-hidden />;
}

function SocialFooterButton({
  item,
  m,
}: {
  item: BioResolvedSocialItem;
  m: ReturnType<typeof useBioMotion>;
}) {
  const buttonClass = cn(
    "flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bio-card-elevated,#fff)]",
    "bio-shadow-soft ring-1 ring-black/[0.04]",
    "transition-[box-shadow,ring-color] duration-200",
    "hover:ring-[var(--bio-primary)]/16"
  );

  if (item.external) {
    return (
      <motion.a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label={item.label}
        variants={m.variants.socialBtn}
        {...m.hover.icon}
      >
        <SocialIcon id={item.id} />
      </motion.a>
    );
  }

  return (
    <motion.div variants={m.variants.socialBtn} {...m.hover.icon}>
      <Link href={item.href} className={buttonClass} aria-label={item.label}>
        <SocialIcon id={item.id} />
      </Link>
    </motion.div>
  );
}

export function SocialFooter({ items, className }: SocialFooterProps) {
  const m = useBioMotion();
  if (!items.length) return null;

  return (
    <footer className={cn("mt-11", className)} aria-label="Redes sociais">
      <motion.nav
        className="flex items-center justify-center gap-6"
        variants={m.variants.social}
        initial={m.initial}
        animate={m.animate}
      >
        {items.map((item) => (
          <SocialFooterButton key={item.id} item={item} m={m} />
        ))}
      </motion.nav>
    </footer>
  );
}
