export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  cloudinaryPublicId?: string | null;
  images: string[];
  featured: boolean;
  stock: number;
  inStock: boolean;
  categoryId: string;
  category?: ProductCategory;
  /** Tipo da peça (clutch, tote, kit, etc.) */
  productType?: string;
  /** Lançamento / novidade */
  isNew?: boolean;
  /** Para ordenação "mais vendidos" */
  salesCount?: number;
  /** Para ordenação "recentes" */
  createdAt?: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  cloudinaryPublicId?: string | null;
  categoryName: string;
  quantity: number;
  observations?: string;
}
