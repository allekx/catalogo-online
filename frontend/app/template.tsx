"use client";

import { PageTransition } from "@/design-system/motion/PageTransition";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
