import type { Request, Response, NextFunction } from "express";

/**
 * Cache HTTP para GET público — CDN e navegador.
 * POST/PUT não devem usar este middleware.
 */
export function cachePublicGet(
  maxAgeSeconds: number,
  staleWhileRevalidateSeconds = 600
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "GET") {
      res.setHeader(
        "Cache-Control",
        `public, max-age=${maxAgeSeconds}, s-maxage=${maxAgeSeconds}, stale-while-revalidate=${staleWhileRevalidateSeconds}`
      );
    }
    next();
  };
}
