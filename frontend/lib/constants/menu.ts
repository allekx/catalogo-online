import type { LucideIcon } from "lucide-react";
import {
  Home,
  ShoppingBag,
  Gift,
  Baby,
  Backpack,
  Sparkles,
  Heart,
  MessageCircle,
  Download,
} from "lucide-react";
import { ROUTES } from "./routes";
import { SOCIAL } from "./social";

export type MenuItemType = "link" | "external" | "action";
export type MenuItemAction = "install-pwa";

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  type: MenuItemType;
  action?: MenuItemAction;
  accent?: "whatsapp" | "instagram" | "app";
}

export interface MenuSection {
  id: string;
  title?: string;
  items: MenuItem[];
}

/** Menu lateral — vitrine pública (sem login, pedidos ou conta) */
export const MOBILE_MENU_SECTIONS: MenuSection[] = [
  {
    id: "main",
    items: [
      {
        id: "home",
        label: "Início",
        href: ROUTES.home,
        icon: Home,
        type: "link",
      },
      {
        id: "catalog",
        label: "Catálogo completo",
        href: ROUTES.catalog,
        icon: ShoppingBag,
        type: "link",
      },
      {
        id: "favorites",
        label: "Favoritos",
        href: ROUTES.favorites,
        icon: Heart,
        type: "link",
      },
    ],
  },
  {
    id: "categories",
    title: "Categorias",
    items: [
      {
        id: "bolsas",
        label: "Bolsas",
        href: `${ROUTES.catalog}?categoria=bolsas`,
        icon: ShoppingBag,
        type: "link",
      },
      {
        id: "kits",
        label: "Kits",
        href: `${ROUTES.catalog}?categoria=kits`,
        icon: Gift,
        type: "link",
      },
      {
        id: "maternidade",
        label: "Maternidade",
        href: `${ROUTES.catalog}?categoria=maternidade`,
        icon: Baby,
        type: "link",
      },
      {
        id: "mochilas",
        label: "Mochilas",
        href: `${ROUTES.catalog}?categoria=mochilas`,
        icon: Backpack,
        type: "link",
      },
      {
        id: "personalizadas",
        label: "Personalizadas",
        href: `${ROUTES.catalog}?categoria=personalizadas`,
        icon: Sparkles,
        type: "link",
      },
    ],
  },
  {
    id: "social",
    title: "Contato",
    items: [
      {
        id: "whatsapp",
        label: "Atendimento WhatsApp",
        href: SOCIAL.whatsapp.url,
        icon: MessageCircle,
        type: "external",
        accent: "whatsapp",
      },
      {
        id: "instagram",
        label: "Instagram",
        href: SOCIAL.instagram,
        icon: Sparkles,
        type: "external",
        accent: "instagram",
      },
      {
        id: "install-app",
        label: "Baixar app Le Maia",
        href: "#",
        icon: Download,
        type: "action",
        action: "install-pwa",
        accent: "app",
      },
    ],
  },
];
