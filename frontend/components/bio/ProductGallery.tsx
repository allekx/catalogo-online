"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Skeleton } from "@/design-system/components/Skeleton";
import type { BioResolvedGalleryItem } from "@/types/bio";
import { cn } from "@/lib/utils/cn";
import { useBioMotion } from "./bio-motion";

export type ProductGalleryProps = {
  title?: string;
  images: BioResolvedGalleryItem[];
  className?: string;
};

function GalleryThumb({
  src,
  alt,
  sizes = "104px",
  priority = false,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const m = useBioMotion();

  return (
    <div
      className={cn(
        "relative aspect-square w-[5.5rem] shrink-0 overflow-hidden rounded-[1.125rem]",
        "bg-[var(--bio-cream-warm,#F7E6DA)]/60 bio-shadow-soft ring-1 ring-black/[0.04]",
        "sm:w-[6rem]"
      )}
    >
      {!loaded && (
        <Skeleton
          variant="rectangular"
          className="absolute inset-0 z-10 h-full w-full rounded-[1.125rem]"
        />
      )}
      <motion.div
        className="relative h-full w-full touch-manipulation"
        {...m.hover.image}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={priority ? undefined : "lazy"}
          priority={priority}
          onLoad={() => setLoaded(true)}
          className={cn(
            "object-cover transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      </motion.div>
    </div>
  );
}

export function ProductGallery({
  title = "Siga & inspire-se",
  images,
  className,
}: ProductGalleryProps) {
  const m = useBioMotion();

  if (!images.length) return null;

  return (
    <section
      className={cn("mt-11", className)}
      aria-labelledby="product-gallery-title"
    >
      {title && (
        <motion.h2
          id="product-gallery-title"
          className="text-center font-display text-[0.8125rem] font-semibold tracking-wide text-[var(--bio-primary)]"
          variants={m.variants.fade}
          initial={m.initial}
          animate={m.animate}
        >
          {title}
        </motion.h2>
      )}
      <motion.div
        className={cn(
          "scroll-touch-x mt-5 -mx-6 px-6 pb-1 snap-x snap-mandatory",
          "sm:-mx-7 sm:px-7"
        )}
        variants={m.variants.galleryRow}
        initial={m.initial}
        animate={m.animate}
      >
        <ul
          className="m-0 flex w-max min-w-full list-none gap-3.5 p-0 pr-5"
          role="list"
        >
          {images.map((item, index) => (
            <motion.li
              key={item.id}
              variants={m.variants.galleryThumb}
              className="snap-start shrink-0 list-none"
            >
              <GalleryThumb
                src={item.imageUrl}
                alt={item.alt}
                priority={index === 0}
              />
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
