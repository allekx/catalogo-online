import { getHealth } from "@/lib/server/handlers/health";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return getHealth();
}
