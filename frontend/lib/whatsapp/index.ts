export { getWhatsAppNumber, WHATSAPP_DEFAULT_GREETING } from "./config";
export {
  buildOrderMessage,
  buildPersonalizationMessage,
  buildGreetingMessage,
} from "./messages";
export { buildWhatsAppUrl, openWhatsApp } from "./open";

import type { CartItem } from "@/lib/products/types";
import { buildOrderMessage } from "./messages";
import { buildWhatsAppUrl, openWhatsApp } from "./open";

/** URL wa.me com itens do carrinho (checkout oficial = WhatsApp) */
export function buildCartOrderWhatsAppUrl(items: CartItem[]): string {
  return buildWhatsAppUrl(buildOrderMessage(items));
}

export function openCartOrderWhatsApp(items: CartItem[]): void {
  openWhatsApp(buildOrderMessage(items));
}

/** @deprecated Use buildCartOrderWhatsAppUrl */
export const buildCartCheckoutUrl = buildCartOrderWhatsAppUrl;

/** @deprecated Use openCartOrderWhatsApp */
export const openCartCheckout = openCartOrderWhatsApp;
