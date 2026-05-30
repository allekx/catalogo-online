import type { NextRequest } from "next/server";
import { getRelatedProducts } from "@/lib/server/handlers/products";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  return getRelatedProducts(params.slug, request);
}
