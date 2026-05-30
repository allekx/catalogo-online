export interface FavoriteItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryName?: string;
  cloudinaryPublicId?: string | null;
  addedAt: number;
}

export type FavoriteProductInput = {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  cloudinaryPublicId?: string | null;
  category?: { name?: string };
};
