import type { NextRequest } from "next/server";
import { serverEnv } from "./env";
import { apiError } from "./http";

export function getAdminKey(request: NextRequest): string | null {
  const header = request.headers.get("x-admin-key");
  if (header) return header;
  const auth = request.headers.get("authorization");
  return auth?.replace(/^Bearer\s+/i, "") ?? null;
}

export function requireAdminKey(request: NextRequest) {
  const key = getAdminKey(request);

  if (!serverEnv.adminApiKey) {
    if (serverEnv.isDevelopment) return null;
    return apiError("Admin API não configurada", 503);
  }

  if (key !== serverEnv.adminApiKey) {
    return apiError("Não autorizado", 401);
  }

  return null;
}

export function requireUploadApiKey(request: NextRequest) {
  const key = request.headers.get("x-api-key");

  if (!serverEnv.uploadApiKey) {
    if (serverEnv.isDevelopment) return null;
    return apiError("Upload API não configurada", 503);
  }

  if (key !== serverEnv.uploadApiKey) {
    return apiError("Não autorizado", 401);
  }

  return null;
}
