import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  port: Number(process.env.PORT || 5001),
  mongoUri:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/best-day-scheduler",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  clientDistPath: path.resolve(__dirname, "../../client/dist"),
  isProduction: process.env.NODE_ENV === "production",
};

