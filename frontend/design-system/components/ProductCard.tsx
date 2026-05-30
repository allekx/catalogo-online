"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PRODUCT_CARD_SIZES } from "@/lib/responsive/imageSizes";
import { MotionHover } from "../motion/MotionHover";
import { formatPrice } from "@/lib/format/currency";
import { cn } from "@/lib/utils/cn";
import { getProductImageUrl } from "@/lib/cloudinary";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "./Button";

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryName?: string;
  cloudinaryPublicId?: string | null;
  className?: string;
  priority?: boolean;
  onBuy?: () => void;
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  imageUrl,
  categoryName,
  cloudinaryPublicId,
  className,
  priority = false,
  onBuy,
}: ProductCardProps) {
  const reduced = usePrefersReducedMotion();
  const imgSrc = getProductImageUrl(imageUrl, cloudinaryPublicId, "card");
  const favoriteProduct = {
    id,
    slug,
    name,
    price,
    imageUrl,
    cloudinaryPublicId,
    category: categoryName ? { name: categoryName } : undefined,
  };
  const isCloudinary = imgSrc.includes("res.cloudinary.com");
  const isExternal = imgSrc.startsWith("http") && !isCloudinary;

  const content = (
    <>
      <Link
        href={ROUTES.product(slug)}
        className="relative block aspect-[4/5] overflow-hidden bg-maia-nude/30"
      >
        <Image
          src={imgSrc}
          alt={name}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          decoding="async"
          unoptimized={isExternal && !isCloudinary}
          sizes={PRODUCT_CARD_SIZES}
          className="object-cover transition-transform duration-500 ease-out group-active:scale-[1.02] md:group-hover:scale-[1.03]"
        />
        <div className="absolute right-2 top-2 sm:right-2.5 sm:top-2.5">
          <FavoriteButton
            product={favoriteProduct}
            size="sm"
            variant="overlay"
            showToast
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3 pt-2.5 sm:p-3.5 sm:pt-3">
        <Link href={ROUTES.product(slug)} className="flex-1">
          {categoryName && (
            <p className="mb-0.5 font-display text-[10px] font-medium uppercase tracking-wide text-maia-light">
              {categoryName}
            </p>
          )}
          <h3 className="line-clamp-2 font-display text-[13px] font-semibold leading-snug text-maia-text sm:text-sm">
            {name}
          </h3>
          <p className="mt-1.5 font-display text-[15px] font-bold text-maia-orange sm:text-base">
            {formatPrice(price)}
          </p>
        </Link>

        <div className="mt-2.5 sm:mt-3">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            className="min-h-[44px] sm:min-h-0"
            leftIcon={<ShoppingBag className="h-3.5 w-3.5" />}
            onClick={(e) => {
              e.preventDefault();
              onBuy?.();
            }}
          >
            Comprar
          </Button>
        </div>
      </div>
    </>
  );

  const cardClass = cn(
    "group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-card",
    className
  );

  if (reduced) {
    return <article className={cardClass}>{content}</article>;
  }

  return (
    <MotionHover className={cardClass}>
      <article className="flex h-full flex-col">{content}</article>
    </MotionHover>
  );
}
