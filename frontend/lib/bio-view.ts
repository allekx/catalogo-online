import type { CSSProperties } from "react";
import type {
  BioLinkKey,
  BioPageData,
  BioResolvedGalleryItem,
  BioResolvedLink,
  BioResolvedSocialItem,
  BioSocialKey,
  BioViewModel,
} from "@/types/bio";

const BIO_LINK_META: Record<BioLinkKey, Omit<BioResolvedLink, "href">> = {
  catalog: {
    id: "catalog",
    label: "Catálogo Online",
    description: "Confira todos os nossos produtos",
    external: false,
    variant: "primary",
  },
  whatsapp: {
    id: "whatsapp",
    label: "Fale Conosco",
    description: "Atendimento rápido pelo WhatsApp",
    external: true,
    variant: "default",
  },
  instagram: {
    id: "instagram",
    label: "Instagram",
    description: "Acompanhe novidades e bastidores",
    external: true,
    variant: "default",
  },
  promotions: {
    id: "promotions",
    label: "Promoções",
    description: "Ofertas exclusivas para você",
    external: false,
    variant: "default",
  },
  maps: {
    id: "maps",
    label: "Localização",
    description: "Encontre nossa loja física",
    external: true,
    variant: "default",
  },
  reviews: {
    id: "reviews",
    label: "Avaliações",
    description: "O que nossas clientes dizem sobre nós",
    external: true,
    variant: "default",
  },
};

const BIO_LINK_ORDER: BioLinkKey[] = [
  "catalog",
  "whatsapp",
  "instagram",
  "promotions",
  "reviews",
];

const BIO_SOCIAL_LABELS: Record<BioSocialKey, string> = {
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  catalog: "Catálogo",
};

export const BIO_GALLERY_TITLE = "Siga & inspire-se";
export const BIO_HERO_ACCENT_LINE = "Feitas com amor para você!";

export function bioThemeStyle(theme: BioPageData["theme"]): CSSProperties {
  return {
    "--bio-primary": theme.primaryColor,
    "--bio-secondary": theme.secondaryColor,
    "--bio-cream": theme.secondaryColor,
  } as CSSProperties;
}

export function companyMonogram(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function isLogoUrl(logo: string): boolean {
  const v = logo.trim();
  return v.startsWith("http") || v.startsWith("/");
}

/** Rotas internas (/icons/*) e paths locais usam <img> — não passam pelo next/image */
export function shouldOptimizeBioLogo(logo: string): boolean {
  const v = logo.trim();
  if (!v.startsWith("http")) return false;
  return true;
}

function resolveLinks(links: BioPageData["links"]): BioResolvedLink[] {
  const resolved: BioResolvedLink[] = [];
  for (const key of BIO_LINK_ORDER) {
    const href = links[key];
    if (!href) continue;
    resolved.push({ ...BIO_LINK_META[key], href });
  }
  return resolved;
}

function resolveGallery(
  gallery: string[],
  companyName: string
): BioResolvedGalleryItem[] {
  return gallery.map((imageUrl, index) => ({
    id: `gallery-${index}`,
    alt: `Destaque ${companyName} ${index + 1}`,
    imageUrl,
  }));
}

function resolveSocial(links: BioPageData["links"]): BioResolvedSocialItem[] {
  const items: BioResolvedSocialItem[] = [];
  const order: BioSocialKey[] = ["instagram", "whatsapp", "catalog"];
  for (const key of order) {
    const href = links[key];
    if (!href) continue;
    items.push({
      id: key,
      label: BIO_SOCIAL_LABELS[key],
      href,
      external: key !== "catalog",
    });
  }
  return items;
}

export function buildBioViewModel(data: BioPageData): BioViewModel {
  const allLinks = resolveLinks(data.links);
  const primaryLink = allLinks.find((l) => l.variant === "primary") ?? null;
  const secondaryLinks = allLinks.filter((l) => l.variant !== "primary");

  return {
    themeStyle: bioThemeStyle(data.theme),
    hero: {
      companyName: data.companyName,
      logo: data.logo,
      logoMonogram: companyMonogram(data.companyName),
      description: data.description,
      accentLine: BIO_HERO_ACCENT_LINE,
    },
    primaryLink,
    secondaryLinks,
    gallery: {
      title: BIO_GALLERY_TITLE,
      images: resolveGallery(data.gallery, data.companyName),
    },
    social: resolveSocial(data.links),
    footer: { companyName: data.companyName },
  };
}
