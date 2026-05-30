import type { NextRequest } from "next/server";
import { uploadAdminMultiple } from "@/lib/server/handlers/upload";
import { requireAdminKey } from "@/lib/server/guards";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const denied = requireAdminKey(request);
  if (denied) return denied;
  return uploadAdminMultiple(request);
}
