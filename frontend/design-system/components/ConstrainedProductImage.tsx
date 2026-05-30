"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export interface ConstrainedProductImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  unoptimized?: boolean;
  /** Proporção do quadro — padrão 4:5 (cards e galeria principal) */
  aspectClassName?: string;
  className?: string;
  imageClassName?: string;
}

/**
 * Imagem de produto sempre contida no quadro (evita tamanho real da foto e clique fora do link).
 */
export function ConstrainedProductImage({
  src,
  alt,
  sizes,
  priority = false,
  unoptimized,
  aspectClassName = "aspect-[4/5]",
  className,
  imageClassName,
}: ConstrainedProductImageProps) {
  const isCloudinary = src.includes("res.cloudinary.com");
  const isExternal = src.startsWith("http") && !isCloudinary;
  const useUnoptimized = unoptimized ?? (isExternal && !isCloudinary);

  return (
    <div
      className={cn("product-media-frame", aspectClassName, className)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding="async"
        unoptimized={useUnoptimized}
        sizes={sizes}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
