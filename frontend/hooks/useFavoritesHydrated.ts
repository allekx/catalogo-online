"use client";

import { useEffect, useState } from "react";
import { useFavoritesStore } from "@/store/useFavoritesStore";

/** Aguarda o persist do Zustand antes de mostrar lista vazia */
export function useFavoritesHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persist = useFavoritesStore.persist;

    if (!persist?.onFinishHydration) {
      setHydrated(true);
      return;
    }

    if (typeof persist.hasHydrated === "function" && persist.hasHydrated()) {
      setHydrated(true);
      return;
    }

    const unsub = persist.onFinishHydration(() => {
      setHydrated(true);
    });

    return unsub;
  }, []);

  return hydrated;
}
