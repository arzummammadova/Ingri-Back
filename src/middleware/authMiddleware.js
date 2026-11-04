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
