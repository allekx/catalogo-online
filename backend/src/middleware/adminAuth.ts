import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export function requireAdminKey(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const key =
    req.headers["x-admin-key"] ??
    req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!env.adminApiKey) {
    if (env.isDevelopment) {
      next();
      return;
    }
    res.status(503).json({ error: "Admin API não configurada" });
    return;
  }

  if (key !== env.adminApiKey) {
    res.status(401).json({ error: "Não autorizado" });
    return;
  }

  next();
}
