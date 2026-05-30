import type { NextRequest } from "next/server";
import {
  adminDeleteCategory,
  adminUpdateCategory,
} from "@/lib/server/handlers/admin";
import { requireAdminKey } from "@/lib/server/guards";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = requireAdminKey(request);
  if (denied) return denied;
  return adminUpdateCategory(params.id, request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = requireAdminKey(request);
  if (denied) return denied;
  return adminDeleteCategory(params.id);
}
