import type { CorsOptions } from "cors";
import { env } from "./env";

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    const allowed = env.corsOrigins;
    const isAllowed =
      allowed.includes(origin) ||
      allowed.includes("*") ||
      (env.isDevelopment && origin.startsWith("http://localhost"));

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado para origem: ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-api-key",
    "x-admin-key",
  ],
  maxAge: 86400,
};
