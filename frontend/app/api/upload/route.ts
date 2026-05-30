import type { NextRequest } from "next/server";
import { uploadSingle } from "@/lib/server/handlers/upload";
import { requireUploadApiKey } from "@/lib/server/guards";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const denied = requireUploadApiKey(request);
  if (denied) return denied;
  return uploadSingle(request);
}
