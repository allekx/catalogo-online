"use client";

import { motion } from "framer-motion";
import { buildBioViewModel } from "@/lib/bio-view";
import type { BioPageData } from "@/types/bio";
import { BioBackground } from "./BioBackground";
import { BioHero } from "./BioHero";
import { BioLinksSection } from "./BioLinksSection";
import { ProductGallery } from "./ProductGallery";
import { SocialFooter } from "./SocialFooter";
import { useBioMotion } from "./bio-motion";

type BioPageViewProps = {
  data: BioPageData;
};

export function BioPageView({ data }: BioPageViewProps) {
  const vm = buildBioViewModel(data);
  const m = useBioMotion();
  const year = new Date().getFullYear();

  return (
    <div
      className="bio-page relative min-h-dvh min-h-screen"
      style={vm.themeStyle}
    >
      <BioBackground secondaryColor={data.theme.secondaryColor} />
      <motion.main
        className="relative mx-auto w-full max-w-app px-6 pb-safe-bottom pt-11 sm:px-7 sm:pt-12"
        variants={m.variants.page}
        initial={m.initial}
        animate={m.animate}
      >
        <motion.div variants={m.variants.section}>
          <BioHero hero={vm.hero} />
        </motion.div>
        <motion.div variants={m.variants.section}>
          <BioLinksSection
            primaryLink={vm.primaryLink}
            secondaryLinks={vm.secondaryLinks}
          />
        </motion.div>
        {vm.gallery.images.length > 0 && (
          <motion.div variants={m.variants.section}>
            <ProductGallery
              title={vm.gallery.title}
              images={vm.gallery.images}
            />
          </motion.div>
        )}
        <motion.div variants={m.variants.section}>
          <SocialFooter items={vm.social} />
        </motion.div>
        <motion.div variants={m.variants.fade}>
          <footer className="mt-11 pb-9 text-center">
            <p className="font-body text-[10px] leading-relaxed text-[var(--bio-text-soft,#999)] sm:text-[11px]">
              © {year} {vm.footer.companyName}. Todos os direitos reservados.
            </p>
          </footer>
        </motion.div>
      </motion.main>
    </div>
  );
}
