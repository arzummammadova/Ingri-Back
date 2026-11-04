import Joi from "joi";
import { CEFR_LEVELS } from "./authValidation.js";

export const PRESET_AVATARS = ["aysel", "nigar", "elvin", "kamran", "sabina", "rashad", "gunel", "tural"];

export const levelSchema = Joi.object({
  level: Joi.string().valid(...CEFR_LEVELS).required(),
});

export const levelsSchema = Joi.object({
  levels: Joi.array().items(Joi.string().valid(...CEFR_LEVELS)).min(1).unique().required(),
  activeLevel: Joi.string().valid(...CEFR_LEVELS),
  placementCompleted: Joi.boolean(),
  suggestedLevel: Joi.string().valid(...CEFR_LEVELS, "").allow(""),
});

export const activeLevelSchema = Joi.object({
  activeLevel: Joi.string().valid(...CEFR_LEVELS).required(),
});

export const planSchema = Joi.object({
  level: Joi.string().valid(...CEFR_LEVELS).required(),
  dailyMinutes: Joi.number().integer().min(5).max(180).required(),
  targetLevel: Joi.string().valid(...CEFR_LEVELS).required(),
  targetDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
});

export const profileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80),
  username: Joi.string().trim().lowercase().pattern(/^[a-z0-9._]{3,20}$/, "username"),
  bio: Joi.string().trim().max(280).allow(""),
  level: Joi.string().valid(...CEFR_LEVELS),
  learningGoals: Joi.array().items(Joi.string().valid("travel", "work", "exams", "daily")).max(4),
  city: Joi.string().trim().max(60).allow(""),
  locale: Joi.string().valid("az", "en", "ru"),
}).min(1);

export const presetSchema = Joi.object({
  preset: Joi.string().valid(...PRESET_AVATARS).required(),
});

export const preferencesSchema = Joi.object({
  theme: Joi.string().valid("light", "dark", "system"),
  accent: Joi.string().valid("ink", "lilac", "aqua", "peach", "mint", "rose", "blue"),
  fontSize: Joi.string().valid("small", "normal", "large"),
  reducedMotion: Joi.boolean(),
  sound: Joi.boolean(),
  volume: Joi.number().min(0).max(1),
  updatedAt: Joi.number().integer().min(0),
}).min(1);
