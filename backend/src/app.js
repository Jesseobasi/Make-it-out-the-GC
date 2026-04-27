import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
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

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/event", eventRoutes);
  app.use(errorHandler);

  return app;
}

