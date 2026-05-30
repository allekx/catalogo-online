"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "./AdminSidebar";
import { clearAdminToken, getAdminToken, isAuthenticated } from "@/lib/admin/auth";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    const ok = Boolean(token) && isAuthenticated();

    if (!ok) {
      clearAdminToken();
      setAuthenticated(false);
      router.replace(
        pathname === "/admin/login"
          ? "/admin/login"
          : `/admin/login?from=${encodeURIComponent(pathname)}`
      );
    } else {
      setAuthenticated(true);
    }
    setAuthChecked(true);
  }, [pathname, router]);

  if (!authChecked) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f8f6f4]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-maia-orange border-t-transparent" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#f8f6f4]">
        <p className="text-sm text-maia-muted">Redirecionando para o login…</p>
      </div>
    );
  }

  return (
    <div className="admin-shell min-h-dvh lg:pl-[var(--sidebar-width)]">
      <AdminSidebar />
      <main className="admin-shell-main min-h-dvh w-full max-w-6xl px-4 pb-10 pt-16 lg:px-8 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
