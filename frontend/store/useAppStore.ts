import { create } from "zustand";

interface AppState {
  isMenuOpen: boolean;
  isSearchOpen: boolean;
  isCartOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  toggleMenu: () => void;
  toggleSearch: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useAppStore = create<AppState>()((set) => ({
  isMenuOpen: false,
  isSearchOpen: false,
  isCartOpen: false,
  setMenuOpen: (open) => set({ isMenuOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setCartOpen: (open) => set({ isCartOpen: open }),
  toggleMenu: () =>
    set((s) => ({
      isMenuOpen: !s.isMenuOpen,
      isSearchOpen: false,
      isCartOpen: false,
    })),
  toggleSearch: () =>
    set((s) => ({
      isSearchOpen: !s.isSearchOpen,
      isMenuOpen: false,
      isCartOpen: false,
    })),
  openCart: () =>
    set({ isCartOpen: true, isMenuOpen: false, isSearchOpen: false }),
  closeCart: () => set({ isCartOpen: false }),
}));

// Favoritos: @/store/useFavoritesStore
// Carrinho: @/store/useCartStore
