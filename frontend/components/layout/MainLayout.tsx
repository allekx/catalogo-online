"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { BottomNavigation } from "./BottomNavigation";
import { DesktopNav } from "./DesktopNav";
import { SearchSheet } from "./SearchSheet";
import { CartBottomSheet } from "@/components/cart/CartBottomSheet";
import { CartFloatingBar } from "@/components/cart/CartFloatingBar";
import { WhatsAppFloatingButton } from "@/components/whatsapp/WhatsAppFloatingButton";
import { useCartStore } from "@/store/useCartStore";
import { ROUTES } from "@/lib/constants/routes";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isAdminArea = pathname.startsWith("/admin");
  const itemCount = useCartStore((s) => s.itemCount);
  const showCartBar =
    !isAdminArea && itemCount > 0 && pathname !== ROUTES.cart;

  useEffect(() => {
    if (isAdminArea) {
      delete document.body.dataset.cartBar;
      return;
    }
    document.body.dataset.cartBar = showCartBar ? "true" : "false";
    return () => {
      delete document.body.dataset.cartBar;
    };
  }, [showCartBar, isAdminArea]);

  if (isAdminArea) {
    return <>{children}</>;
  }

  return (
    <div className="app-root">
      <Navbar />
      <div className="app-layout-body">
        <DesktopNav />
        <main className="app-main page-padding scroll-smooth-touch">
          <div className="app-content">{children}</div>
        </main>
      </div>
      <BottomNavigation />
      <CartFloatingBar />
      <SearchSheet />
      <CartBottomSheet />
      <WhatsAppFloatingButton />
    </div>
  );
}
