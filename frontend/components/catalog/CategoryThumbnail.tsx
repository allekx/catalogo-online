"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type CategoryThumbnailProps = {
  name: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-12 w-12 text-lg",
  md: "h-16 w-16 text-2xl sm:h-[4.75rem] sm:w-[4.75rem] sm:text-2xl",
  lg: "h-[4.25rem] w-[4.25rem] text-xl sm:h-[4.75rem] sm:w-[4.75rem] sm:text-2xl",
};

export function CategoryThumbnail({
  name,
  imageUrl,
  size = "lg",
  className,
}: CategoryThumbnailProps) {
  const letter = name.charAt(0).toUpperCase() || "?";
  const sizeClass = sizeClasses[size];

  if (imageUrl) {
    return (
      <span
        className={cn(
          "relative block shrink-0 overflow-hidden rounded-full bg-maia-nude/80 shadow-sm ring-1 ring-maia-text/[0.04]",
          sizeClass,
          className
        )}
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes={size === "sm" ? "48px" : "80px"}
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-maia-nude/80 font-display font-bold text-maia-orange shadow-sm ring-1 ring-maia-text/[0.04]",
        sizeClass,
        className
      )}
      aria-hidden
    >
      {letter}
    </span>
  );
}
