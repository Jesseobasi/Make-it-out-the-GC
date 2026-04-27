import crypto from "node:crypto";

const SHORT_ID_LENGTH = 7;

export function generateUuid() {
  return crypto.randomUUID();
}

export function generateShortId() {
  return crypto
    .randomBytes(6)
    .toString("base64url")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, SHORT_ID_LENGTH)
    .toLowerCase();
}

