import type { ProductCategory } from "./types";

/** Resposta bruta da API REST antes de normalização */
export interface ApiProductPayload {
  id: string;
  slug: string;
  name: string;
  description?: string;
  price: number | string;
  imageUrl: string;
  cloudinaryPublicId?: string | null;
  images?: string[];
  featured?: boolean;
  stock?: number;
  inStock?: boolean;
  categoryId: string;
  category?: ProductCategory;
  productType?: string;
  isNew?: boolean;
  salesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiCategoryPayload {
  id: string;
  slug: string;
  name: string;
  imageUrl?: string | null;
  cloudinaryPublicId?: string | null;
}
