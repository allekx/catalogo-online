import { NextResponse } from "next/server";

export function json<T>(data: T, status = 200, extraHeaders?: HeadersInit) {
  return NextResponse.json(data, {
    status,
    headers: extraHeaders,
  });
}

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function cacheHeaders(sMaxAge: number, staleWhileRevalidate?: number) {
  const swr = staleWhileRevalidate ?? sMaxAge * 5;
  return {
    "Cache-Control": `public, s-maxage=${sMaxAge}, stale-while-revalidate=${swr}`,
  };
}

/** Use nas rotas: export const runtime = "nodejs"; export const dynamic = "force-dynamic"; */
