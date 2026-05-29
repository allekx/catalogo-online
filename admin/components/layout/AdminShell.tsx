"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { isAuthenticated } from "@/lib/auth";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [pathname, router]);

  if (!isAuthenticated()) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-maia-orange border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:pl-[var(--sidebar-width)]">
      <AdminSidebar />
      <main className="min-h-screen px-4 pb-8 pt-16 lg:px-8 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
