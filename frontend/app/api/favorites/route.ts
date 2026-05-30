import type { NextRequest } from "next/server";
import {
  createFavorite,
  deleteFavorite,
  listFavorites,
} from "@/lib/server/handlers/favorites";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return listFavorites(request);
}

export async function POST(request: NextRequest) {
  return createFavorite(request);
}

export async function DELETE(request: NextRequest) {
  return deleteFavorite(request);
}
