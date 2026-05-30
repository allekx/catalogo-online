"use client";

import { useEffect, useState } from "react";
import { useFavoritesStore } from "@/store/useFavoritesStore";

/** Aguarda o Zustand persist carregar do localStorage antes de mostrar lista vazia */
export function useFavoritesHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const store = useFavoritesStore.persist;

    if (store.hasHydrated()) {
      setHydrated(true);
      return;
    }

    return store.onFinishHydration(() => {
      setHydrated(true);
    });
  }, []);

  return hydrated;
}
