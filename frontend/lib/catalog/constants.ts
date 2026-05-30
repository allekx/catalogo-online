import type { CatalogSort } from "./types";

export const CATALOG_CATEGORIES = [
  { slug: "bolsas", name: "Bolsas" },
  { slug: "kits", name: "Kits" },
  { slug: "maternidade", name: "Maternidade" },
  { slug: "mochilas", name: "Mochilas" },
  { slug: "personalizadas", name: "Personalizadas" },
  { slug: "necessaires", name: "Necessáires" },
] as const;

export const PRODUCT_TYPES = [
  { slug: "clutch", label: "Clutch" },
  { slug: "tote", label: "Tote" },
  { slug: "bolsa", label: "Bolsa" },
  { slug: "kit", label: "Kit" },
  { slug: "mochila", label: "Mochila" },
  { slug: "necessaire", label: "Nécessaire" },
  { slug: "personalizada", label: "Personalizada" },
] as const;

export const PRICE_RANGES = [
  { id: "all", label: "Todos os preços", min: null, max: null },
  { id: "ate-200", label: "Até R$ 200", min: null, max: 200 },
  { id: "200-400", label: "R$ 200 – R$ 400", min: 200, max: 400 },
  { id: "acima-400", label: "Acima de R$ 400", min: 400, max: null },
] as const;

export const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "recent", label: "Recentes" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "bestsellers", label: "Mais vendidos" },
];
