export const durations = {
  instant: 100,
  fast: 150,
  base: 250,
  slow: 400,
  slower: 600,
} as const;

export const easings = {
  default: [0.4, 0, 0.2, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  out: [0, 0, 0.2, 1] as const,
  spring: { type: "spring" as const, stiffness: 400, damping: 30 },
  softSpring: { type: "spring" as const, stiffness: 320, damping: 28 },
};

export const motionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
  },
  slideDown: {
    initial: { opacity: 0, y: -16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  },
  stagger: {
    animate: { transition: { staggerChildren: 0.06 } },
  },
};

export const transition = {
  fast: { duration: durations.fast / 1000, ease: easings.default },
  base: { duration: durations.base / 1000, ease: easings.default },
  slow: { duration: durations.slow / 1000, ease: easings.default },
};
