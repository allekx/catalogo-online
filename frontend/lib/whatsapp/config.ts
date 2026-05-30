/** Número apenas dígitos (DDI + DDD + número) — configure em .env.local */
export function getWhatsAppNumber(): string {
  const raw =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511999999999";
  return raw.replace(/\D/g, "");
}

export const WHATSAPP_DEFAULT_GREETING =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
  "Olá! Gostaria de saber mais sobre as bolsas Le Maia.";
