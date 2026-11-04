import fs from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/authModel.js";
import { publicUser } from "../utils/publicUser.js";
import { removeAvatarFile } from "./authController.js";

function cloudinaryEnabled() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export async function updateLevel(req, res, next) {
  try {
    req.user.levels = [req.body.level];
    req.user.activeLevel = req.body.level;
    req.user.placementCompleted = true;
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
}

export async function updateLevels(req, res, next) {
  try {
    const levels = [...new Set(req.body.levels)];
    const active = levels.includes(req.body.activeLevel) ? req.body.activeLevel : levels[0];
    req.user.levels = levels;
    req.user.activeLevel = active;
    if (req.body.placementCompleted) req.user.placementCompleted = true;
    if (req.body.suggestedLevel) req.user.suggestedLevel = req.body.suggestedLevel;
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
}

export async function updateActiveLevel(req, res, next) {
  try {
    const levels = req.user.levels?.length ? req.user.levels : [req.user.level || "A1"];
    if (!levels.includes(req.body.activeLevel)) {
      return res.status(400).json({ code: "VALIDATION" });
    }
    req.user.levels = levels;
    req.user.activeLevel = req.body.activeLevel;
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
}

export async function savePlan(req, res, next) {
  try {
    const levels = req.user.levels?.length ? req.user.levels : [req.user.activeLevel];
    if (!levels.includes(req.body.level)) return res.status(400).json({ code: "VALIDATION" });
    const plans = (req.user.plans || []).filter((plan) => plan.level !== req.body.level);
    plans.push({
      level: req.body.level,
      dailyMinutes: req.body.dailyMinutes,
      targetLevel: req.body.targetLevel,
      targetDate: req.body.targetDate,
    });
    req.user.plans = plans;
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    if (req.body.username !== undefined && req.body.username !== req.user.username) {
      const taken = await req.user.constructor.exists({ username: req.body.username, _id: { $ne: req.user._id } });
      if (taken) return res.status(409).json({ code: "USERNAME_TAKEN" });
      req.user.username = req.body.username;
      req.user.name = req.body.username;
    }
    const fields = ["name", "bio", "level", "learningGoals", "city", "locale"];
    for (const field of fields) {
      if (req.body[field] !== undefined) req.user[field] = req.body[field];
    }
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
}

export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ code: "INVALID_FILE" });
    await removeAvatarFile(req.user);
    let avatarUrl = `/api/uploads/avatars/${path.basename(req.file.path)}`;
    if (cloudinaryEnabled()) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "learn-english/avatars",
        public_id: String(req.user._id),
        overwrite: true,
      });
      avatarUrl = uploaded.secure_url;
      await fs.unlink(req.file.path).catch(() => {});
    }
    req.user.avatarType = "upload";
    req.user.avatarUrl = avatarUrl;
    req.user.avatarPreset = "";
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
}

export async function choosePreset(req, res, next) {
  try {
    await removeAvatarFile(req.user);
    req.user.avatarType = "preset";
    req.user.avatarPreset = req.body.preset;
    req.user.avatarUrl = "";
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
}

export async function deleteAvatar(req, res, next) {
  try {
    await removeAvatarFile(req.user);
    if (req.user.avatarUrl?.includes("res.cloudinary.com") && cloudinaryEnabled()) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      await cloudinary.uploader.destroy(`learn-english/avatars/${req.user._id}`).catch(() => {});
    }
    req.user.avatarType = "none";
    req.user.avatarPreset = "";
    req.user.avatarUrl = "";
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
}

export async function listPresets(_req, res) {
  res.json({
    presets: ["aysel", "nigar", "elvin", "kamran", "sabina", "rashad", "gunel", "tural"],
  });
}

export { User };

export async function updatePreferences(req, res, next) {
  try {
    const current = req.user.preferences?.toObject?.() || req.user.preferences || {};
    req.user.preferences = { ...current, ...req.body, updatedAt: req.body.updatedAt || Date.now() };
    await req.user.save();
    res.json({ user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
}
