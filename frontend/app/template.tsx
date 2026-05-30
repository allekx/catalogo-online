"use client";

import { usePathname } from "next/navigation";
import { PageTransition } from "@/design-system/motion/PageTransition";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }
  return <PageTransition>{children}</PageTransition>;
}
