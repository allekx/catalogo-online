import { isCloudinaryConfigured } from "../env";
import { prisma } from "../prisma";
import { json } from "../http";

function databaseHintFromError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (msg.includes("P1001") || msg.includes("Can't reach database")) {
    return "Servidor não alcança o Supabase. Confira DATABASE_URL na Vercel (pooler :6543, pgbouncer=true, senha com %2A para *).";
  }
  if (msg.includes("P1000") || msg.includes("Authentication failed")) {
    return "Senha ou usuário incorretos em DATABASE_URL/DIRECT_URL na Vercel.";
  }
  if (msg.includes("Environment variable not found")) {
    return "DATABASE_URL ausente nas variáveis de ambiente da Vercel.";
  }
  return "Falha na conexão PostgreSQL. Compare DATABASE_URL e DIRECT_URL com o painel Supabase.";
}

export async function getHealth() {
  let database: "connected" | "disconnected" = "disconnected";
  let databaseHint: string | undefined;

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "connected";
  } catch (error) {
    console.error("[health] database", error);
    databaseHint = databaseHintFromError(error);
  }

  const healthy = database === "connected";

  return json(
    {
      status: healthy ? "ok" : "degraded",
      service: "le-maia-api",
      timestamp: new Date().toISOString(),
      database,
      ...(databaseHint ? { databaseHint } : {}),
      cloudinary: isCloudinaryConfigured() ? "configured" : "not_configured",
    },
    healthy ? 200 : 503
  );
}
