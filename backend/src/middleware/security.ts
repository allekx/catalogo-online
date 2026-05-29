import type { Express, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { env } from "../config/env";

export function applySecurityMiddleware(app: Express): void {
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: env.isProduction ? undefined : false,
      hsts: env.isProduction
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
    })
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: env.isProduction ? 200 : 1000,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: "Muitas requisições. Tente novamente em breve." },
    })
  );

  app.use(
    "/api/upload",
    rateLimit({
      windowMs: 60 * 1000,
      max: env.isProduction ? 20 : 100,
      message: { error: "Limite de uploads excedido." },
    })
  );
}

export function requireUploadApiKey(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const key = req.headers["x-api-key"];

  if (!env.uploadApiKey) {
    if (env.isProduction) {
      res.status(503).json({ error: "Upload não configurado" });
      return;
    }
    next();
    return;
  }

  if (key !== env.uploadApiKey) {
    res.status(401).json({ error: "API key inválida" });
    return;
  }

  next();
}
