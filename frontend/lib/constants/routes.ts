/** Rotas públicas do catálogo — sem área de login ou conta do cliente */

export const ROUTES = {
  home: "/",
  catalog: "/catalogo",
  categories: "/categorias",
  product: (slug: string) => `/catalogo/${slug}`,
  favorites: "/favoritos",
  cart: "/carrinho",
  about: "/sobre",
} as const;

export type RouteKey = keyof typeof ROUTES;
