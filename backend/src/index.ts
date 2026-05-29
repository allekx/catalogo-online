import "dotenv/config";
import { createApp } from "./app";
import { initCloudinary } from "./lib/cloudinary";
import { env, assertProductionEnv } from "./config/env";
import { logger } from "./lib/logger";

assertProductionEnv();
initCloudinary();

const app = createApp();
const HOST = "0.0.0.0";

app.listen(env.port, HOST, () => {
  logger.info("server_started", {
    host: HOST,
    port: env.port,
    cors: env.corsOrigins,
  });
});
