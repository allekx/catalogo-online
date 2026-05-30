import type { NextRequest } from "next/server";
import {
  adminCreateProduct,
  adminListProducts,
} from "@/lib/server/handlers/admin";
import { requireAdminKey } from "@/lib/server/guards";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = requireAdminKey(request);
  if (denied) return denied;
  return adminListProducts();
}

export async function POST(request: NextRequest) {
  const denied = requireAdminKey(request);
  if (denied) return denied;
  return adminCreateProduct(request);
}
