import { env } from "../config/env";

type LogLevel = "debug" | "info" | "warn" | "error";

type LogMeta = Record<string, unknown>;

function write(level: LogLevel, message: string, meta?: LogMeta): void {
  const entry = {
    level,
    message,
    service: "le-maia-api",
    env: env.nodeEnv,
    time: new Date().toISOString(),
    ...meta,
  };

  const line = JSON.stringify(entry);

  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  debug(message: string, meta?: LogMeta) {
    if (!env.isProduction) write("debug", message, meta);
  },
  info(message: string, meta?: LogMeta) {
    write("info", message, meta);
  },
  warn(message: string, meta?: LogMeta) {
    write("warn", message, meta);
  },
  error(message: string, meta?: LogMeta) {
    write("error", message, meta);
  },
};
