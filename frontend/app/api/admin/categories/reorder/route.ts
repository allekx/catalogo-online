import type { NextRequest } from "next/server";
import { adminReorderCategories } from "@/lib/server/handlers/admin";
import { requireAdminKey, requireDatabase } from "@/lib/server/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  const db = requireDatabase();
  if (db) return db;
  const denied = requireAdminKey(request);
  if (denied) return denied;
  return adminReorderCategories(request);
}
