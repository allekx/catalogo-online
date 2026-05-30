import type { NextRequest } from "next/server";
import { adminUpdateOrderStatus } from "@/lib/server/handlers/admin";
import { requireAdminKey } from "@/lib/server/guards";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = requireAdminKey(request);
  if (denied) return denied;
  return adminUpdateOrderStatus(params.id, request);
}
