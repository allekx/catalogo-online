import type { NextRequest } from "next/server";
import { listProducts } from "@/lib/server/handlers/products";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return listProducts(request);
}
