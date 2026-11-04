import jwt from "jsonwebtoken";
import User from "../models/authModel.js";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ code: "UNAUTHENTICATED" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ code: "UNAUTHENTICATED" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ code: "UNAUTHENTICATED" });
  }
}

export function optionalAuth(req, _res, next) {
  const token = req.cookies?.accessToken;
  if (!token) return next();
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) return next();
    req.user = await User.findById(payload.sub);
    next();
  });
}

/** Resolve the signed-in user (if any) without failing the request. */
export function userFromRequest(req) {
  if (req.user) return Promise.resolve(req.user);
  const token = req.cookies?.accessToken;
  if (!token) return Promise.resolve(null);
  return new Promise((resolve) => {
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) return resolve(null);
      try { resolve(await User.findById(payload.sub).select("_id").lean()); } catch { resolve(null); }
    });
  });
}
