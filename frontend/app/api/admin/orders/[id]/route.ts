import type { NextRequest } from "next/server";
import { adminDeleteOrder, adminGetOrder } from "@/lib/server/handlers/admin";
import { requireAdminKey } from "@/lib/server/guards";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = requireAdminKey(request);
  if (denied) return denied;
  return adminGetOrder(params.id);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = requireAdminKey(request);
  if (denied) return denied;
  return adminDeleteOrder(params.id);
}
