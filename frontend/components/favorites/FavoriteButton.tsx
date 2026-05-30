"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "@/design-system";
import type { FavoriteProductInput } from "@/lib/favorites/types";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { cn } from "@/lib/utils/cn";
import { easings } from "@/design-system/tokens/animations";

type FavoriteButtonSize = "sm" | "md";
type FavoriteButtonVariant = "overlay" | "inline";

interface FavoriteButtonProps {
  product: FavoriteProductInput;
  size?: FavoriteButtonSize;
  variant?: FavoriteButtonVariant;
  showToast?: boolean;
  className?: string;
  onToggle?: (favorited: boolean) => void;
}

const sizeStyles: Record<
  FavoriteButtonSize,
  { button: string; icon: string }
> = {
  sm: { button: "h-10 w-10 sm:h-8 sm:w-8", icon: "h-4 w-4" },
  md: { button: "h-11 w-11", icon: "h-5 w-5" },
};

export function FavoriteButton({
  product,
  size = "sm",
  variant = "overlay",
  showToast = true,
  className,
  onToggle,
}: FavoriteButtonProps) {
  const favorited = useFavoritesStore((s) => s.isFavorite(product.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const styles = sizeStyles[size];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.id?.trim()) {
      if (showToast) toast.warning("Não foi possível salvar este favorito");
      return;
    }
    const added = toggleFavorite(product);
    onToggle?.(added);
    if (showToast) {
      toast.success(
        added ? "Salvo nos favoritos" : "Removido dos favoritos"
      );
    }
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={cn(
        "relative flex touch-manipulation items-center justify-center rounded-full transition-colors",
        styles.button,
        variant === "overlay" &&
          "bg-white/95 text-maia-muted shadow-sm backdrop-blur-sm active:scale-90",
        variant === "inline" &&
          "border border-maia-rose/50 bg-white text-maia-muted",
        favorited && "text-maia-orange",
        className
      )}
      aria-label={
        favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"
      }
      aria-pressed={favorited}
    >
      {favorited && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full bg-maia-orange/15"
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: 1.55, opacity: 0 }}
          transition={{ duration: 0.45, ease: easings.out }}
        />
      )}
      <motion.span
        className="relative flex items-center justify-center"
        animate={
          favorited
            ? { scale: [1, 1.28, 1] }
            : { scale: 1 }
        }
        transition={
          favorited
            ? { duration: 0.38, ease: easings.out }
            : { duration: 0.2 }
        }
      >
        <Heart
          className={cn(styles.icon, "transition-colors duration-200")}
          fill={favorited ? "currentColor" : "none"}
          strokeWidth={favorited ? 2 : 1.85}
        />
      </motion.span>
    </motion.button>
  );
}
