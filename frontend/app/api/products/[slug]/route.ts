import { getProduct } from "@/lib/server/handlers/products";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  return getProduct(params.slug);
}
