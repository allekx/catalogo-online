import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors";
import { applySecurityMiddleware } from "./middleware/security";
import { requestLogger } from "./middleware/requestLogger";
import { logger } from "./lib/logger";
import { healthRouter } from "./routes/health";
import { productsRouter } from "./routes/products";
import { categoriesRouter } from "./routes/categories";
import { uploadRouter } from "./routes/upload";
import { favoritesRouter } from "./routes/favorites";
import { adminRouter } from "./routes/admin";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  applySecurityMiddleware(app);
  app.use(requestLogger);
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  app.get("/", (_req, res) => {
    res.json({
      name: "Le Maia API",
      version: "1.0.0",
      docs: "/api/health",
    });
  });

  app.use("/api/health", healthRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/categories", categoriesRouter);
  app.use("/api/favorites", favoritesRouter);
  app.use("/api/upload", uploadRouter);
  app.use("/api/admin", adminRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Rota não encontrada" });
  });

  app.use(
    (
      err: Error & { status?: number; code?: string },
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      logger.error("unhandled_error", {
        message: err.message,
        code: err.code,
      });

      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({ error: "Arquivo muito grande (máx. 5MB)" });
        return;
      }

      const status = err.status ?? 500;
      res.status(status).json({
        error: err.message ?? "Erro interno do servidor",
      });
    }
  );

  return app;
}
