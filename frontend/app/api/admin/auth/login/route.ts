import type { NextRequest } from "next/server";
import { adminLogin } from "@/lib/server/handlers/admin";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  return adminLogin(request);
}
