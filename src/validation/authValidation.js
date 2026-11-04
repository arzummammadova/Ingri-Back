import Joi from "joi";

const password = Joi.string()
  .min(10)
  .max(72)
  .pattern(/[a-z]/, "lowercase")
  .pattern(/[A-Z]/, "uppercase")
  .pattern(/[0-9]/, "number")
  .pattern(/[^A-Za-z0-9]/, "symbol")
  .required();

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const registerSchema = Joi.object({
  username: Joi.string().trim().lowercase().pattern(/^[a-z0-9._]{3,20}$/, "username").required(),
  email: Joi.string().trim().lowercase().email().required(),
  password,
  locale: Joi.string().valid("az", "en", "ru").default("az"),
  level: Joi.string().valid(...CEFR_LEVELS).default("A1"),
  gender: Joi.string().valid("female", "male", "").default(""),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(1).max(72).required(),
});

export const emailSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
});

export const tokenSchema = Joi.object({
  token: Joi.string().hex().min(20).max(200).required(),
});

export const resetSchema = Joi.object({
  token: Joi.string().hex().min(20).max(200).required(),
  password,
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().allow("").max(72).default(""),
  password,
});

export const deleteAccountSchema = Joi.object({
  password: Joi.string().allow("").max(72).default(""),
});
