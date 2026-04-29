import crypto from "crypto";

const TOKEN_VERSION = "v1";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30;

function toBase64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(payload, secret) {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createAuthToken(email, secret) {
  const normalizedEmail = email.trim().toLowerCase();
  const payload = JSON.stringify({
    v: TOKEN_VERSION,
    email: normalizedEmail,
    iat: Date.now(),
  });
  const encodedPayload = toBase64Url(payload);
  const signature = signPayload(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export function verifyAuthToken(token, secret) {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload, secret);
  if (signature.length !== expectedSignature.length) {
    return null;
  }
  const isValidSignature = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  if (!isValidSignature) {
    return null;
  }

  const parsed = JSON.parse(fromBase64Url(encodedPayload));
  if (parsed.v !== TOKEN_VERSION || !parsed.email || !parsed.iat) {
    return null;
  }

  if (Date.now() - Number(parsed.iat) > MAX_AGE_MS) {
    return null;
  }

  return {
    email: parsed.email,
  };
}
