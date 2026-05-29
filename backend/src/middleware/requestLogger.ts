import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { logger } from "../lib/logger";

/** Logs estruturados por requisição (Railway / produção) */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!env.isProduction) {
    next();
    return;
  }

  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";

    logger[level]("http_request", {
      method: req.method,
      path: req.originalUrl.split("?")[0],
      status: res.statusCode,
      durationMs,
      ip: req.ip,
    });
  });

  next();
}
