import crypto from "crypto";
import { csrfCookieOptions } from "../utils/tokens.js";

function allowedOrigins() {
  return (process.env.FRONTEND_ORIGIN || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ensureCsrf(req, res, next) {
  if (!req.cookies?.csrfToken) {
    res.cookie("csrfToken", crypto.randomBytes(32).toString("hex"), csrfCookieOptions());
  }
  next();
}

export function csrfProtection(req, res, next) {
  const method = req.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return next();

  const origin = req.get("origin");
  const allowed = allowedOrigins();
  if (!origin || (allowed.length && !allowed.includes(origin))) {
    return res.status(403).json({ code: "FORBIDDEN" });
  }

  const cookie = req.cookies?.csrfToken;
  const header = req.get("x-csrf-token");
  if (!cookie || !header || cookie !== header) {
    return res.status(403).json({ code: "INVALID_CSRF" });
  }
  next();
}
