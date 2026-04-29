import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { getEventMetadata } from "./controllers/ogController.js";
import { optionalAuth } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        const error = new Error("Not allowed by CORS.");
        error.status = 403;
        return callback(error);
      },
    })
  );
  app.use(express.json({ limit: "20kb" }));
  app.use(optionalAuth);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/event/:shortId/meta", getEventMetadata);
  app.use("/api/auth", authRoutes);
  app.use("/api/event", eventRoutes);
  app.use(errorHandler);

  return app;
}

