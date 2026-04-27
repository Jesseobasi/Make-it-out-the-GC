import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { startExpiredEventCleanupJob } from "./utils/cleanup.js";

const app = createApp();

connectDatabase()
  .then(() => {
    startExpiredEventCleanupJob(env.cleanupIntervalHours);

    app.listen(env.port, () => {
      console.log(`Best Day Scheduler backend listening on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });

