import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { connectToDatabase } from "./db.js";
import { config } from "./config.js";
import eventsRouter from "./routes/events.js";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === config.clientUrl) {
        return callback(null, true);
      }

      const error = new Error("Not allowed by CORS");
      error.status = 403;
      return callback(error);
    },
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/event", eventsRouter);

if (config.isProduction && fs.existsSync(config.clientDistPath)) {
  app.use(express.static(config.clientDistPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(config.clientDistPath, "index.html"));
  });
}

app.use((error, _req, res, _next) => {
  const message = error?.message || "Something went wrong.";
  const status = error?.status || 500;
  res.status(status).json({ message });
});

connectToDatabase()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Best Day Scheduler API listening on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });
