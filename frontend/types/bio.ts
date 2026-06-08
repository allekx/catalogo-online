import type { CSSProperties } from "react";

/** Dados serializáveis da /bio (servidor → client) */
export type BioPageData = {
  companyName: string;
  logo: string;
  description: string;
  links: {
    catalog?: string;
    whatsapp?: string;
    instagram?: string;
    promotions?: string;
    maps?: string;
    reviews?: string;
  };
  gallery: string[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
};

export type BioLinkKey = keyof BioPageData["links"];

export type BioResolvedLink = {
  id: BioLinkKey;
  label: string;
  description: string;
  href: string;
  external: boolean;
  variant?: "primary" | "default";
};

export type BioResolvedGalleryItem = {
  id: string;
  alt: string;
  imageUrl: string;
};

export type BioSocialKey = "instagram" | "whatsapp" | "catalog";

export type BioResolvedSocialItem = {
  id: BioSocialKey;
  label: string;
  href: string;
  external: boolean;
};

export type BioViewModel = {
  themeStyle: CSSProperties;
  hero: {
    companyName: string;
    logo: string;
    logoMonogram: string;
    description: string;
    accentLine: string;
  };
  primaryLink: BioResolvedLink | null;
  secondaryLinks: BioResolvedLink[];
  gallery: {
    title: string;
    images: BioResolvedGalleryItem[];
  };
  social: BioResolvedSocialItem[];
  footer: {
    companyName: string;
  };
};
