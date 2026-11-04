import rateLimit, { ipKeyGenerator } from "express-rate-limit";

/**
 * Requests arrive through the Vercel /api rewrite, so req.ip is a shared Vercel edge IP.
 * Key on the real client IP Vercel forwards (falls back to req.ip).
 */
export function clientKey(req) {
  const raw = req.headers["x-vercel-forwarded-for"] || req.headers["x-real-ip"] || String(req.headers["x-forwarded-for"] || "").split(",")[0];
  const ip = String(raw || req.ip || "").trim() || "unknown";
  return ipKeyGenerator(ip);
}

const common = {
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: "RATE_LIMITED" },
  keyGenerator: clientKey,
  validate: { xForwardedForHeader: false, keyGeneratorIpFallback: false },
};

/** Session reads (GET /me, /csrf, POST /refresh) happen on every page load: generous. */
export const sessionLimiter = rateLimit({
  ...common,
  windowMs: 15 * 60 * 1000,
  limit: 1500,
});

export const authLimiter = rateLimit({
  ...common,
  windowMs: 15 * 60 * 1000,
  limit: 40,
});

export const loginLimiter = rateLimit({
  ...common,
  windowMs: 15 * 60 * 1000,
  limit: 10,
});

export const notesLimiter = rateLimit({
  ...common,
  windowMs: 15 * 60 * 1000,
  limit: 300,
});

export const chatLimiter = rateLimit({
  ...common,
  windowMs: 60 * 1000,
  limit: 12,
  keyGenerator: (req) => (req.user?._id ? String(req.user._id) : clientKey(req)),
});
