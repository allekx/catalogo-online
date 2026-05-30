import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = buildPageMetadata({
  title: "Carrinho",
  description: "Revise seus itens e finalize pelo WhatsApp.",
  path: ROUTES.cart,
  noIndex: true,
});

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
