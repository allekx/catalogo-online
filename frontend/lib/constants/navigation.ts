import {
  Home,
  LayoutGrid,
  Heart,
  Store,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "./routes";

/** Navegação inferior — apenas vitrine pública (sem conta/pedidos) */
export const PUBLIC_BOTTOM_NAV: {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: "favorites";
}[] = [
  { href: ROUTES.home, label: "Início", icon: Home, exact: true },
  { href: ROUTES.catalog, label: "Catálogo", icon: Store },
  { href: ROUTES.categories, label: "Categorias", icon: LayoutGrid },
  { href: ROUTES.favorites, label: "Favoritos", icon: Heart, badge: "favorites" },
];

/** Sidebar desktop — catálogo público */
export const PUBLIC_DESKTOP_NAV: {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: "favorites" | "cart";
}[] = [
  { href: ROUTES.home, label: "Início", icon: Home, exact: true },
  { href: ROUTES.catalog, label: "Catálogo", icon: Store },
  { href: ROUTES.categories, label: "Categorias", icon: LayoutGrid },
  { href: ROUTES.favorites, label: "Favoritos", icon: Heart, badge: "favorites" },
  { href: ROUTES.cart, label: "Carrinho", icon: ShoppingBag, badge: "cart" },
];
