"use client";

import { useState, useCallback, useId } from "react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { ConstrainedProductImage } from "@/design-system/components/ConstrainedProductImage";
import { cn } from "@/lib/utils/cn";
import { getOptimizedGalleryUrls } from "@/lib/products/images";
import { PRODUCT_GALLERY_SIZES } from "@/lib/responsive/imageSizes";
import type { Product } from "@/lib/products/types";

interface ProductGalleryProps {
  product: Product;
  productName: string;
}

export function ProductGallery({ product, productName }: ProductGalleryProps) {
  const images = getOptimizedGalleryUrls(product);
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const zoomTitleId = useId();
  const closeZoom = useCallback(() => setZoomOpen(false), []);
  useEscapeKey(zoomOpen, closeZoom);
  useBodyScrollLock(zoomOpen);
  const dragX = useMotionValue(0);
  const opacity = useTransform(dragX, [-120, 0, 120], [0.6, 1, 0.6]);

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % images.length) + images.length) % images.length);
      dragX.set(0);
    },
    [images.length, dragX]
  );

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) goTo(index + 1);
    else if (info.offset.x > threshold) goTo(index - 1);
    dragX.set(0);
  };

  const current = images[index] ?? images[0];
  const isCloudinary = current?.includes("res.cloudinary.com");
  const isExternal = current?.startsWith("http") && !isCloudinary;
  const canSwipe = images.length > 1;

  return (
    <>
      <div className="-mx-4 sm:-mx-6 lg:mx-0">
        <motion.div
          style={{ opacity }}
          className="mx-auto w-full max-w-md touch-pan-y lg:max-w-none"
        >
          <div
            className="relative overflow-hidden rounded-none bg-maia-nude/40 sm:rounded-2xl lg:rounded-3xl"
            style={{ touchAction: "pan-y" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                drag={canSwipe ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                dragDirectionLock
                dragListener={canSwipe}
                onDragEnd={onDragEnd}
                style={{ x: canSwipe ? dragX : 0 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                <ConstrainedProductImage
                  src={current}
                  alt={`${productName} — foto ${index + 1}`}
                  priority={index === 0}
                  sizes={PRODUCT_GALLERY_SIZES}
                  className="max-h-[min(72vh,640px)] w-full lg:max-h-[520px]"
                />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm"
              aria-label="Ampliar imagem"
            >
              <ZoomIn className="h-5 w-5 text-maia-text" strokeWidth={1.75} />
            </button>

            {canSwipe && (
              <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Imagem ${i + 1}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {canSwipe && (
          <div className="flex gap-2 overflow-x-auto px-4 py-3 hide-scrollbar lg:px-0">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => goTo(i)}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 transition-all",
                  i === index
                    ? "ring-maia-orange"
                    : "ring-transparent opacity-70"
                )}
              >
                <Image
                  src={src}
                  alt={`${productName} — miniatura ${i + 1}`}
                  fill
                  loading="lazy"
                  decoding="async"
                  unoptimized={
                    src.startsWith("http") &&
                    !src.includes("res.cloudinary.com")
                  }
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={zoomTitleId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-maia-text/90 p-4 backdrop-blur-sm"
            onClick={closeZoom}
          >
            <span id={zoomTitleId} className="sr-only">
              Ampliar {productName}
            </span>
            <button
              type="button"
              onClick={closeZoom}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white safe-top"
              aria-label="Fechar ampliação"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="product-media-frame relative mx-auto aspect-[4/5] h-[min(80vh,600px)] w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={current}
                alt={productName}
                fill
                unoptimized={isExternal}
                className="object-contain"
                sizes={PRODUCT_GALLERY_SIZES}
              />
            </motion.div>
            {canSwipe && (
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 safe-bottom">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(index - 1);
                  }}
                  className="rounded-full bg-white/20 px-4 py-2 text-sm text-white"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(index + 1);
                  }}
                  className="rounded-full bg-white/20 px-4 py-2 text-sm text-white"
                >
                  Próxima
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
