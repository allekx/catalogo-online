import type { NextRequest } from "next/server";
import {
  adminDeleteCustomer,
  adminGetCustomer,
} from "@/lib/server/handlers/admin";
import { requireAdminKey } from "@/lib/server/guards";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = requireAdminKey(request);
  if (denied) return denied;
  return adminGetCustomer(params.id);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = requireAdminKey(request);
  if (denied) return denied;
  return adminDeleteCustomer(params.id);
}
