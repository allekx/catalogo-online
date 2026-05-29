import { Router } from "express";
import { env } from "../../config/env";

export const adminAuthRouter = Router();

adminAuthRouter.post("/login", (req, res) => {
  const { password } = req.body as { password?: string };

  if (!password || password !== env.adminPassword) {
    res.status(401).json({ error: "Senha inválida" });
    return;
  }

  res.json({
    token: env.adminApiKey,
    expiresIn: null,
  });
});
