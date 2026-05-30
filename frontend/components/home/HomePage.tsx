"use client";

import { StaggerReveal, StaggerItem } from "@/design-system/motion";
import type { Product } from "@/lib/products/types";
import { HomeBannerSlider } from "./HomeBannerSlider";
import { HomeCategoriesScroll } from "./HomeCategoriesScroll";
import { HomeProductsSection } from "./HomeProductsSection";

interface HomePageProps {
  featuredProducts?: Product[];
}

export function HomePage({ featuredProducts = [] }: HomePageProps) {
  return (
    <div className="scroll-smooth">
      <StaggerReveal stagger={0.08} delay={0.02}>
        <StaggerItem>
          <HomeBannerSlider />
        </StaggerItem>
        <StaggerItem>
          <HomeCategoriesScroll />
        </StaggerItem>
        <StaggerItem>
          <HomeProductsSection initialProducts={featuredProducts} />
        </StaggerItem>
      </StaggerReveal>
    </div>
  );
}
