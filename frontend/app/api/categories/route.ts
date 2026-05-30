import { listCategories } from "@/lib/server/handlers/categories";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return listCategories();
}
