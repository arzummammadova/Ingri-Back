import crypto from "crypto";
import User from "../models/authModel.js";
import Progress from "../models/progressModel.js";
import { DEFAULT_TASKS } from "../utils/activity.js";
import { sendMail } from "../utils/sendMail.js";
import { frontendUrl, welcomeEmail } from "../utils/emailTemplates.js";
import { uniqueUsername } from "../utils/username.js";
import { completeLogin } from "./authController.js";

const STATE_COOKIE = "g_state";
const LOCALES = ["az", "en", "ru"];

function config() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callback = process.env.GOOGLE_CALLBACK_URL || `${frontendUrl()}/api/auth/google/callback`;
  return clientId && clientSecret ? { clientId, clientSecret, callback } : null;
}

function stateCookieOptions() {
  // Lax: the cookie must survive the top-level redirect back from accounts.google.com.
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/api/auth/google", maxAge: 10 * 60 * 1000 };
}

/** Navigates via a same-site HTML hop so SameSite=Strict auth cookies are sent on the next page. */
function bounce(res, url) {
  const safe = url.replace(/"/g, "%22");
  res.set("Cache-Control", "no-store").type("html").send(
    `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${safe}"><title>Ingri</title><script>location.replace(${JSON.stringify(url)})</script>`,
  );
}

export function googleStart(req, res) {
  const cfg = config();
  const locale = LOCALES.includes(req.query.locale) ? req.query.locale : "az";
  if (!cfg) return res.redirect(`${frontendUrl()}/${locale}/login?error=google`);
  const nonce = crypto.randomBytes(24).toString("hex");
  const state = `${nonce}.${locale}`;
  res.cookie(STATE_COOKIE, state, stateCookieOptions());
  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: cfg.callback,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
    access_type: "online",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}

export async function googleCallback(req, res) {
  const stateParam = String(req.query.state || "");
  const locale = LOCALES.includes(stateParam.split(".")[1]) ? stateParam.split(".")[1] : "az";
  const fail = (reason) => {
    if (reason) console.warn("[google]", reason);
    res.clearCookie(STATE_COOKIE, { path: "/api/auth/google" });
    return bounce(res, `${frontendUrl()}/${locale}/login?error=google`);
  };
  try {
    const cfg = config();
    if (!cfg) return fail("not configured");
    const cookieState = req.cookies?.[STATE_COOKIE];
    if (!cookieState || !stateParam || cookieState.length !== stateParam.length
      || !crypto.timingSafeEqual(Buffer.from(cookieState), Buffer.from(stateParam))) return fail("state mismatch");
    if (req.query.error || !req.query.code) return fail(req.query.error || "no code");
    res.clearCookie(STATE_COOKIE, { path: "/api/auth/google" });

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code: String(req.query.code), client_id: cfg.clientId, client_secret: cfg.clientSecret, redirect_uri: cfg.callback, grant_type: "authorization_code" }),
    });
    if (!tokenRes.ok) return fail(`token ${tokenRes.status}`);
    const tokens = await tokenRes.json();
    const infoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    if (!infoRes.ok) return fail(`userinfo ${infoRes.status}`);
    const profile = await infoRes.json();
    if (!profile.email || profile.email_verified === false) return fail("email not verified");

    const email = String(profile.email).toLowerCase();
    let user = await User.findOne({ email });
    let created = false;
    if (!user) {
      user = await User.create({
        name: (profile.name || email.split("@")[0]).slice(0, 80),
        username: await uniqueUsername(User, email.split("@")[0]),
        email,
        googleId: profile.sub,
        authProvider: "google",
        locale,
        level: "A1",
        levels: ["A1"],
        activeLevel: "A1",
        placementCompleted: false,
        avatarType: profile.picture ? "upload" : "preset",
        avatarUrl: profile.picture || "",
        avatarPreset: "aysel",
        isVerified: true,
      });
      await Progress.create({ user: user._id, tasks: DEFAULT_TASKS });
      created = true;
    } else {
      if (!user.googleId) user.googleId = profile.sub;
      user.isVerified = true;
      user.failedLogins = 0;
      user.lockUntil = undefined;
      await user.save();
    }
    await completeLogin(res, user);
    if (created) {
      const mail = welcomeEmail({ name: user.name, locale: user.locale });
      sendMail({ to: user.email, ...mail }).catch((error) => console.error("[mail] welcome failed:", error?.message || error));
    }
    return bounce(res, `${frontendUrl()}/${LOCALES.includes(user.locale) ? user.locale : locale}/${created ? "onboarding" : "dashboard"}`);
  } catch (error) {
    return fail(error?.message);
  }
}
