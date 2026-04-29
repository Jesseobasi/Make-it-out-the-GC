import { env } from "../config/env.js";
import { verifyAuthToken } from "../utils/authToken.js";

function getBearerToken(headerValue) {
  if (!headerValue || typeof headerValue !== "string") {
    return "";
  }

  const [scheme, token] = headerValue.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return "";
  }

  return token.trim();
}

export function optionalAuth(req, _res, next) {
  const token = getBearerToken(req.headers.authorization);
  if (!token) {
    return next();
  }

  const user = verifyAuthToken(token, env.authSecret);
  if (user) {
    req.user = user;
  }

  return next();
}

export function requireAuth(req, res, next) {
  if (!req.user?.email) {
    return res.status(401).json({ message: "Login required." });
  }

  return next();
}
