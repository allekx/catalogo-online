"use client";

import {
  MapPin,
  MessageCircle,
  ShoppingBag,
  Star,
  Tag,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import type { BioLinkKey } from "@/types/bio";
import { cn } from "@/lib/utils/cn";

const iconClass = "h-[1.15rem] w-[1.15rem]";

type BioLinkIconProps = {
  id: BioLinkKey;
  className?: string;
};

export function BioLinkIcon({ id, className }: BioLinkIconProps) {
  const cls = cn(iconClass, className);

  switch (id) {
    case "catalog":
      return <ShoppingBag className={cls} strokeWidth={1.5} aria-hidden />;
    case "whatsapp":
      return <MessageCircle className={cls} strokeWidth={1.5} aria-hidden />;
    case "instagram":
      return <InstagramIcon className={cls} />;
    case "promotions":
      return <Tag className={cls} strokeWidth={1.5} aria-hidden />;
    case "maps":
      return <MapPin className={cls} strokeWidth={1.5} aria-hidden />;
    case "reviews":
      return <Star className={cls} strokeWidth={1.5} aria-hidden />;
    default:
      return <ShoppingBag className={cls} strokeWidth={1.5} aria-hidden />;
  }
}
