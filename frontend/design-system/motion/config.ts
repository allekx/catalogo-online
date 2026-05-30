import type { Transition, Variants } from "framer-motion";

/** Easing premium — suave no enter, rápido no exit */
export const easePremium = [0.25, 0.1, 0.25, 1] as const;
export const easeOutSoft = [0, 0, 0.2, 1] as const;

export const springPress = {
  type: "spring" as const,
  stiffness: 520,
  damping: 28,
  mass: 0.6,
};

export const springSoft = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
};

export const duration = {
  fast: 0.2,
  base: 0.32,
  slow: 0.45,
};

export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: duration.base, ease: easePremium },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.base, ease: easeOutSoft },
  },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: easePremium },
  },
};

export const slideUpSubtle: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.fast, ease: easePremium },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.base, ease: easePremium },
  },
};

export const staggerContainer = (stagger = 0.06, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

export const press = {
  tap: { scale: 0.96 },
  hover: { scale: 1.02 },
};

export const hoverLift = {
  rest: { y: 0, boxShadow: "0 4px 24px rgba(34,34,34,0.06)" },
  hover: {
    y: -3,
    boxShadow: "0 12px 32px rgba(34,34,34,0.08)",
    transition: springSoft,
  },
};

export const skeletonShimmer: Transition = {
  duration: 1.4,
  ease: "linear",
  repeat: Infinity,
};

/** Sem animação — prefers-reduced-motion */
export const reduced = {
  initial: false as const,
  animate: false as const,
  transition: { duration: 0 },
};
