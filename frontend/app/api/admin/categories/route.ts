import type { NextRequest } from "next/server";
import {
  adminCreateCategory,
  adminListCategories,
} from "@/lib/server/handlers/admin";
import { requireAdminKey, requireDatabase } from "@/lib/server/guards";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const db = requireDatabase();
  if (db) return db;
  const denied = requireAdminKey(request);
  if (denied) return denied;
  return adminListCategories();
}

export async function POST(request: NextRequest) {
  const db = requireDatabase();
  if (db) return db;
  const denied = requireAdminKey(request);
  if (denied) return denied;
  return adminCreateCategory(request);
}
