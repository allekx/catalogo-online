import { Router } from "express";
import { prisma } from "../lib/prisma";
import { isCloudinaryConfigured } from "../config/env";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  let database: "connected" | "disconnected" = "disconnected";

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "connected";
  } catch {
    database = "disconnected";
  }

  const healthy = database === "connected";

  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    service: "le-maia-api",
    timestamp: new Date().toISOString(),
    database,
    cloudinary: isCloudinaryConfigured() ? "configured" : "not_configured",
  });
});
