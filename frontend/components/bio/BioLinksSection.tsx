"use client";

import { motion } from "framer-motion";
import type { BioResolvedLink } from "@/types/bio";
import { BioLinkCard } from "./BioLinkCard";
import { PrimaryLinkCard } from "./PrimaryLinkCard";
import { useBioMotion } from "./bio-motion";

type BioLinksSectionProps = {
  primaryLink: BioResolvedLink | null;
  secondaryLinks: BioResolvedLink[];
};

export function BioLinksSection({
  primaryLink,
  secondaryLinks,
}: BioLinksSectionProps) {
  const m = useBioMotion();

  if (!primaryLink && secondaryLinks.length === 0) return null;

  return (
    <motion.nav
      className="mt-9 space-y-3.5"
      aria-label="Links principais"
      variants={m.variants.links}
      initial={m.initial}
      animate={m.animate}
    >
      {primaryLink && (
        <motion.div variants={m.variants.linkItem}>
          <PrimaryLinkCard
            linkId={primaryLink.id}
            title={primaryLink.label}
            description={primaryLink.description}
            href={primaryLink.href}
            external={primaryLink.external}
          />
        </motion.div>
      )}
      {secondaryLinks.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-3 p-0" role="list">
          {secondaryLinks.map((item) => (
            <motion.li
              key={item.id}
              variants={m.variants.linkItem}
              className="list-none"
            >
              <BioLinkCard
                linkId={item.id}
                title={item.label}
                description={item.description}
                href={item.href}
                external={item.external}
              />
            </motion.li>
          ))}
        </ul>
      )}
    </motion.nav>
  );
}
