import Joi from "joi";

export const podcastProgressSchema = Joi.object({
  slug: Joi.string().trim().required(),
  seconds: Joi.number().integer().min(0).max(36000).required(),
  completed: Joi.boolean().default(false),
});

export const quizSchema = Joi.object({
  slug: Joi.string().trim().required(),
  score: Joi.number().integer().min(0).max(100).required(),
});

export const listeningSchema = Joi.object({
  slug: Joi.string().trim().required(),
  score: Joi.number().integer().min(0).max(100).required(),
});

export const speakingSchema = Joi.object({
  slug: Joi.string().trim().required(),
  score: Joi.number().integer().min(0).max(100).required(),
});

export const wordSchema = Joi.object({
  slug: Joi.string().trim().required(),
  status: Joi.string().valid("new", "learning", "known").required(),
});

export const podcastQuizSchema = Joi.object({
  slug: Joi.string().trim().required(),
  score: Joi.number().integer().min(0).max(100).required(),
});

export const timeSchema = Joi.object({
  skill: Joi.string().valid("listening", "reading", "speaking", "grammar", "words").required(),
  seconds: Joi.number().integer().min(1).max(180).required(),
  level: Joi.string().valid("A1", "A2", "B1", "B2", "C1", "C2").required(),
});

export const watchSchema = Joi.object({
  kind: Joi.string().valid("video", "movie").required(),
  id: Joi.string().trim().max(80).required(),
});

export const favoriteSchema = Joi.object({
  slug: Joi.string().trim().required(),
});

export const taskSchema = Joi.object({
  key: Joi.string().valid("words", "grammar", "podcast", "speaking").required(),
  done: Joi.boolean().required(),
});

export const itemSchema = Joi.object({
  kind: Joi.string().valid("video", "movie", "podcast", "book", "chapter", "grammar", "listening", "speaking").required(),
  slug: Joi.string().trim().max(200).required(),
  level: Joi.string().valid("A1", "A2", "B1", "B2", "C1", "C2").allow(""),
  percent: Joi.number().min(0).max(100).default(0),
  completed: Joi.boolean().default(false),
});
