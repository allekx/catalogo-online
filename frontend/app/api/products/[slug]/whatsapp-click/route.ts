import { trackWhatsAppClick } from "@/lib/server/handlers/products";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  return trackWhatsAppClick(params.slug);
}
