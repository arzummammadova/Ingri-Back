import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const common = {
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: "RATE_LIMITED" },
};

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
  keyGenerator: (req) => String(req.user?._id || ipKeyGenerator(req.ip)),
});
