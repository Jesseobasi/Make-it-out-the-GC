import dotenv from "dotenv";

dotenv.config();

function parseOrigins(value) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || process.env.port || 5001),
  mongoUri:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/make-it-out-the-group-chat",
  allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS || "http://localhost:5173"),
  cleanupIntervalHours: Number(process.env.CLEANUP_INTERVAL_HOURS || 24),
  authSecret: process.env.AUTH_SECRET || "dev-auth-secret-change-me",
};

