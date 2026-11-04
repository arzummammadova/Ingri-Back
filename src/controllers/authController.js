import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import User from "../models/authModel.js";
import Progress from "../models/progressModel.js";
import RefreshToken from "../models/refreshTokenModel.js";
import { sendMail } from "../utils/sendMail.js";
import { publicUser } from "../utils/publicUser.js";
import { touchStreak } from "../utils/activity.js";
import { DEFAULT_TASKS } from "../utils/activity.js";
import {
  accessCookieOptions,
  clearCookieOptions,
  csrfCookieOptions,
  hashToken,
  randomToken,
  refreshCookieOptions,
} from "../utils/tokens.js";

const ACCESS_TTL = "15m";
const REFRESH_MS = 7 * 24 * 60 * 60 * 1000;
const VERIFY_MS = 24 * 60 * 60 * 1000;
const RESET_MS = 30 * 60 * 1000;
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;

function appOrigin() {
  return (process.env.FRONTEND_ORIGIN || "http://127.0.0.1:43123").split(",")[0].trim();
}

function signAccess(user) {
  return jwt.sign({ sub: String(user._id), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TTL,
  });
}

async function issueRefresh(userId) {
  const raw = randomToken(48);
  await RefreshToken.create({
    user: userId,
    tokenHash: hashToken(raw),
    expiresAt: new Date(Date.now() + REFRESH_MS),
  });
  return raw;
}

function setAuthCookies(res, access, refresh) {
  res.cookie("accessToken", access, accessCookieOptions());
  res.cookie("refreshToken", refresh, refreshCookieOptions());
  res.cookie("csrfToken", randomToken(32), csrfCookieOptions());
}

export function clearAuthCookies(res) {
  res.clearCookie("accessToken", clearCookieOptions());
  res.clearCookie("refreshToken", clearCookieOptions());
}

function mailLink(locale, path, token) {
  return `${appOrigin()}/${locale}/${path}?token=${token}`;
}

async function sendVerifyMail(user, raw) {
  const link = mailLink(user.locale || "az", "verify-email", raw);
  const az = user.locale !== "en";
  await sendMail({
    to: user.email,
    subject: az ? "Ingri hesabını təsdiqlə" : "Verify your Ingri account",
    text: az
      ? `Hesabını təsdiqləmək üçün bu keçidi aç (24 saat etibarlıdır): ${link}`
      : `Open this link to verify your account (valid for 24 hours): ${link}`,
    html: `<p>${az ? "Hesabını təsdiqləmək üçün aşağıdakı keçidi aç." : "Open the link below to verify your account."}</p><p><a href="${link}">${link}</a></p>`,
  });
}

export async function csrf(_req, res) {
  const token = randomToken(32);
  res.cookie("csrfToken", token, csrfCookieOptions());
  res.json({ csrfToken: token });
}

export async function register(req, res, next) {
  try {
    const email = req.body.email.toLowerCase();
    const existing = await User.findOne({ email }).select("+verifyTokenHash");
    if (!existing) {
      const raw = randomToken(32);
      const user = await User.create({
        name: req.body.name,
        email,
        password: await bcrypt.hash(req.body.password, 12),
        locale: req.body.locale || "az",
        level: req.body.level || "A1",
        levels: [req.body.level || "A1"],
        activeLevel: req.body.level || "A1",
        placementCompleted: false,
        avatarType: "preset",
        avatarPreset: "aysel",
        verifyTokenHash: hashToken(raw),
        verifyTokenExpires: new Date(Date.now() + VERIFY_MS),
      });
      await Progress.create({ user: user._id, tasks: DEFAULT_TASKS });
      await sendVerifyMail(user, raw);
    } else if (!existing.isVerified) {
      const raw = randomToken(32);
      existing.verifyTokenHash = hashToken(raw);
      existing.verifyTokenExpires = new Date(Date.now() + VERIFY_MS);
      await existing.save();
      await sendVerifyMail(existing, raw);
    } else {
      await sendMail({
        to: existing.email,
        subject: "Ingri",
        text: "Someone tried to create an account with your email. If this was you, sign in instead.",
        html: "<p>Someone tried to create an account with your email. If this was you, sign in instead.</p>",
      });
    }
    res.status(201).json({ code: "CHECK_EMAIL" });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("+password");
    const invalid = () => res.status(401).json({ code: "INVALID_CREDENTIALS" });
    if (!user) return invalid();
    if (user.lockUntil && user.lockUntil > new Date()) return invalid();
    const matches = await bcrypt.compare(req.body.password, user.password);
    if (!matches) {
      user.failedLogins = (user.failedLogins || 0) + 1;
      if (user.failedLogins >= MAX_FAILS) {
        user.lockUntil = new Date(Date.now() + LOCK_MS);
        user.failedLogins = 0;
      }
      await user.save();
      return invalid();
    }
    if (!user.isVerified) return res.status(403).json({ code: "EMAIL_NOT_VERIFIED" });
    user.failedLogins = 0;
    user.lockUntil = undefined;
    await user.save();
    const refresh = await issueRefresh(user._id);
    setAuthCookies(res, signAccess(user), refresh);
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const raw = req.cookies?.refreshToken;
    if (!raw) return res.status(401).json({ code: "UNAUTHENTICATED" });
    const tokenHash = hashToken(raw);
    const stored = await RefreshToken.findOne({
      tokenHash,
      revoked: false,
      expiresAt: { $gt: new Date() },
    });
    if (!stored) {
      const reused = await RefreshToken.findOne({ tokenHash });
      if (reused) await RefreshToken.updateMany({ user: reused.user }, { revoked: true });
      clearAuthCookies(res);
      return res.status(401).json({ code: "UNAUTHENTICATED" });
    }
    const user = await User.findById(stored.user);
    if (!user) {
      clearAuthCookies(res);
      return res.status(401).json({ code: "UNAUTHENTICATED" });
    }
    const nextRaw = await issueRefresh(user._id);
    stored.revoked = true;
    stored.replacedBy = hashToken(nextRaw);
    await stored.save();
    setAuthCookies(res, signAccess(user), nextRaw);
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const raw = req.cookies?.refreshToken;
    if (raw) await RefreshToken.updateOne({ tokenHash: hashToken(raw) }, { revoked: true });
    clearAuthCookies(res);
    res.json({ code: "LOGGED_OUT" });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  try {
    if (req.user?.save && touchStreak(req.user)) await req.user.save();
  } catch {
    /* streak is best-effort */
  }
  res.json({ user: publicUser(req.user) });
}

export async function verifyEmail(req, res, next) {
  try {
    const user = await User.findOne({
      verifyTokenHash: hashToken(req.body.token),
      verifyTokenExpires: { $gt: new Date() },
    }).select("+verifyTokenHash +verifyTokenExpires");
    if (!user) return res.status(400).json({ code: "INVALID_TOKEN" });
    user.isVerified = true;
    user.verifyTokenHash = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();
    res.json({ code: "EMAIL_VERIFIED" });
  } catch (error) {
    next(error);
  }
}

export async function resendVerification(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select(
      "+verifyTokenHash +verifyTokenExpires",
    );
    if (user && !user.isVerified) {
      const raw = randomToken(32);
      user.verifyTokenHash = hashToken(raw);
      user.verifyTokenExpires = new Date(Date.now() + VERIFY_MS);
      await user.save();
      await sendVerifyMail(user, raw);
    }
    res.json({ code: "CHECK_EMAIL" });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select(
      "+resetTokenHash +resetTokenExpires",
    );
    if (user && user.isVerified) {
      const raw = randomToken(32);
      user.resetTokenHash = hashToken(raw);
      user.resetTokenExpires = new Date(Date.now() + RESET_MS);
      await user.save();
      const link = mailLink(user.locale || "az", "reset-password", raw);
      const az = user.locale !== "en";
      await sendMail({
        to: user.email,
        subject: az ? "Şifrəni yenilə" : "Reset your password",
        text: az
          ? `Şifrəni yeniləmək üçün keçid (30 dəqiqə): ${link}`
          : `Reset your password (valid for 30 minutes): ${link}`,
        html: `<p><a href="${link}">${link}</a></p>`,
      });
    }
    res.json({ code: "CHECK_EMAIL" });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const user = await User.findOne({
      resetTokenHash: hashToken(req.body.token),
      resetTokenExpires: { $gt: new Date() },
    }).select("+password +resetTokenHash +resetTokenExpires");
    if (!user) return res.status(400).json({ code: "INVALID_TOKEN" });
    user.password = await bcrypt.hash(req.body.password, 12);
    user.resetTokenHash = undefined;
    user.resetTokenExpires = undefined;
    user.failedLogins = 0;
    user.lockUntil = undefined;
    await user.save();
    await RefreshToken.updateMany({ user: user._id }, { revoked: true });
    res.json({ code: "PASSWORD_UPDATED" });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("+password");
    const matches = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!matches) return res.status(400).json({ code: "INVALID_CREDENTIALS" });
    user.password = await bcrypt.hash(req.body.password, 12);
    await user.save();
    await RefreshToken.deleteMany({ user: user._id });
    const refresh = await issueRefresh(user._id);
    setAuthCookies(res, signAccess(user), refresh);
    res.json({ code: "PASSWORD_UPDATED" });
  } catch (error) {
    next(error);
  }
}

export async function deleteAccount(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("+password");
    const matches = await bcrypt.compare(req.body.password, user.password);
    if (!matches) return res.status(400).json({ code: "INVALID_CREDENTIALS" });
    await removeAvatarFile(user);
    await Progress.deleteOne({ user: user._id });
    await RefreshToken.deleteMany({ user: user._id });
    await user.deleteOne();
    clearAuthCookies(res);
    res.json({ code: "ACCOUNT_DELETED" });
  } catch (error) {
    next(error);
  }
}

export async function removeAvatarFile(user) {
  if (user.avatarType === "upload" && user.avatarUrl?.startsWith("/api/uploads/")) {
    const relative = user.avatarUrl.replace("/api/uploads/", "");
    const file = path.join(process.cwd(), "uploads", relative);
    await fs.unlink(file).catch(() => {});
  }
}
