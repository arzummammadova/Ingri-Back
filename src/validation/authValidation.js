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
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password,
  locale: Joi.string().valid("az", "en").default("az"),
  level: Joi.string().valid(...CEFR_LEVELS).default("A1"),
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
  currentPassword: Joi.string().min(1).max(72).required(),
  password,
});

export const deleteAccountSchema = Joi.object({
  password: Joi.string().min(1).max(72).required(),
});
