"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ClipboardList,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { clearAdminToken } from "@/lib/admin/auth";
import { cn } from "@/lib/admin/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: FolderOpen },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    clearAdminToken();
    router.replace("/admin/login");
  };

  const navContent = (
    <>
      <div className="border-b border-black/[0.06] px-5 py-6">
        <Link href="/admin" className="font-display text-xl font-bold tracking-tight">
          Le <span className="text-maia-orange">Maia</span>
        </Link>
        <p className="mt-1 text-xs text-maia-muted">Painel administrativo</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-maia-orange text-white shadow-sm"
                  : "text-maia-text hover:bg-maia-nude/60"
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-black/[0.06] p-3">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-maia-muted transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-[var(--sidebar-width)] lg:flex-col lg:border-r lg:border-black/[0.06] lg:bg-white">
        {navContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(280px,85vw)] flex-col bg-white shadow-xl">
            <button
              type="button"
              className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-lg hover:bg-maia-nude/50"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
