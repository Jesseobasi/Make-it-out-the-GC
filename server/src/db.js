import mongoose from "mongoose";
import { config } from "./config.js";

export async function connectToDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongoUri);
}

