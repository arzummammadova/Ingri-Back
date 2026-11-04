import crypto from "crypto";

const secure = process.env.NODE_ENV === "production";

export function hashToken(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

function baseCookie() {
  return {
    secure,
    sameSite: "strict",
    path: "/",
  };
}

export function accessCookieOptions() {
  return { ...baseCookie(), httpOnly: true, maxAge: 15 * 60 * 1000 };
}

export function refreshCookieOptions() {
  return { ...baseCookie(), httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 };
}

export function csrfCookieOptions() {
  return { ...baseCookie(), httpOnly: false, maxAge: 7 * 24 * 60 * 60 * 1000 };
}

export function clearCookieOptions() {
  return { ...baseCookie(), httpOnly: true };
}
