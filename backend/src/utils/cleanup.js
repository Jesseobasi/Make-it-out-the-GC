import { Event } from "../models/Event.js";

export async function deleteExpiredEvents() {
  const result = await Event.deleteMany({
    expiresAt: { $lt: new Date() },
  });

  return result.deletedCount || 0;
}

export function startExpiredEventCleanupJob(intervalHours = 24) {
  const intervalMs = Math.max(1, intervalHours) * 60 * 60 * 1000;
  const timer = setInterval(() => {
    deleteExpiredEvents().catch((error) => {
      console.error("Expired event cleanup failed", error);
    });
  }, intervalMs);

  timer.unref?.();
  return timer;
}

