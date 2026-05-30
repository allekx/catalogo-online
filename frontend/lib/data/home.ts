import { ROUTES } from "@/lib/constants/routes";

export const HOME_CATEGORIES = [
  { slug: "bolsas", name: "Bolsas", icon: "👜", color: "#F7E6DA" },
  { slug: "kits", name: "Kits", icon: "🎁", color: "#E9C7B5" },
  { slug: "maternidade", name: "Maternidade", icon: "🤱", color: "#FFE8D6" },
  { slug: "mochilas", name: "Mochilas", icon: "🎒", color: "#F7E6DA" },
  { slug: "personalizadas", name: "Personalizadas", icon: "✨", color: "#E9C7B5" },
  { slug: "necessaires", name: "Necessáires", icon: "💄", color: "#FFE8D6" },
] as const;

export const HOME_BANNERS = [
  {
    id: "1",
    title: "Coleção Exclusiva",
    subtitle: "Bolsas feitas com amor e elegância",
    cta: "Ver categorias",
    href: ROUTES.categories,
    gradient: "from-maia-nude via-white to-maia-rose",
    accent: "#FF6B00",
  },
  {
    id: "2",
    title: "Personalize a sua",
    subtitle: "Monograma, cores e detalhes únicos",
    cta: "Começar agora",
    href: `${ROUTES.catalog}?categoria=personalizadas`,
    gradient: "from-maia-rose/80 via-maia-nude to-white",
    accent: "#E9C7B5",
  },
  {
    id: "3",
    title: "Linha Maternidade",
    subtitle: "Organização e estilo para mamães",
    cta: "Explorar linha",
    href: `${ROUTES.catalog}?categoria=maternidade`,
    gradient: "from-[#FFE8D6] via-maia-nude to-maia-rose/60",
    accent: "#FF6B00",
  },
] as const;

export interface HomeProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryName: string;
  categorySlug: string;
  cloudinaryPublicId?: string | null;
}
