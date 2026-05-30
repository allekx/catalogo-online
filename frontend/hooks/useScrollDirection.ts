"use client";

import { useEffect, useState } from "react";

type ScrollDirection = "up" | "down" | null;

export function useScrollDirection(threshold = 10): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>(null);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < threshold) return;
      setDirection(y > lastY ? "down" : "up");
      setLastY(y);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY, threshold]);

  return direction;
}
