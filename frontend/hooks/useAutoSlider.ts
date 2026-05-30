"use client";

import { useCallback, useEffect, useState } from "react";

export function useAutoSlider(length: number, intervalMs = 5000) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (i: number) => setIndex(((i % length) + length) % length),
    [length]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    if (length <= 1 || paused) return;
    const id = setInterval(next, intervalMs);
    return () => clearInterval(id);
  }, [length, paused, intervalMs, next]);

  return { index, goTo, next, paused, setPaused };
}
