import { buildWhatsAppUrl } from "@/lib/whatsapp/open";
import { WHATSAPP_DEFAULT_GREETING } from "@/lib/whatsapp/config";

/** Links externos — configure em .env.local */
export const SOCIAL = {
  whatsapp: {
    number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511999999999",
    message: WHATSAPP_DEFAULT_GREETING,
    get url() {
      return buildWhatsAppUrl(this.message);
    },
  },
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
    "https://instagram.com/lemaia",
} as const;
