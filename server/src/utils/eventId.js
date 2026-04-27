import crypto from "node:crypto";

export function generateEventId() {
  return crypto.randomBytes(4).toString("hex");
}

