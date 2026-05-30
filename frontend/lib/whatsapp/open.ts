import { getWhatsAppNumber } from "./config";

/**
 * Monta URL wa.me com encode automático (mobile + desktop)
 */
export function buildWhatsAppUrl(message: string): string {
  const number = getWhatsAppNumber();
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

/**
 * Abre WhatsApp — funciona em iOS, Android e desktop (app ou web)
 */
export function openWhatsApp(message: string): void {
  if (typeof window === "undefined") return;

  const url = buildWhatsAppUrl(message);

  const isMobile =
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  if (isMobile) {
    window.location.href = url;
    return;
  }

  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.location.href = url;
  }
}
