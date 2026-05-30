import type { NextRequest } from "next/server";
import { deleteUploaded } from "@/lib/server/handlers/upload";
import { requireUploadApiKey } from "@/lib/server/guards";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { publicId: string } }
) {
  const denied = requireUploadApiKey(request);
  if (denied) return denied;
  return deleteUploaded(params.publicId);
}
