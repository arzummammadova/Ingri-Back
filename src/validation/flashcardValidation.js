import Joi from "joi";

export const flashcardIdSchema = Joi.string().hex().length(24);

export const createFlashcardSchema = Joi.object({
  word: Joi.string().trim().min(1).max(120).required(),
  translation: Joi.string().trim().min(1).max(200).required(),
  example: Joi.string().trim().max(400).allow("").default(""),
  category: Joi.string().trim().max(60).allow("").default(""),
});

export const updateFlashcardSchema = Joi.object({
  word: Joi.string().trim().min(1).max(120),
  translation: Joi.string().trim().min(1).max(200),
  example: Joi.string().trim().max(400).allow(""),
  category: Joi.string().trim().max(60).allow(""),
  status: Joi.string().valid("new", "learning", "known"),
}).min(1);
