import { isCloudinaryConfigured } from "../env";
import { prisma } from "../prisma";
import { json } from "../http";

export async function getHealth() {
  let database: "connected" | "disconnected" = "disconnected";

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "connected";
  } catch {
    database = "disconnected";
  }

  const healthy = database === "connected";

  return json(
    {
      status: healthy ? "ok" : "degraded",
      service: "le-maia-api",
      timestamp: new Date().toISOString(),
      database,
      cloudinary: isCloudinaryConfigured() ? "configured" : "not_configured",
    },
    healthy ? 200 : 503
  );
}
