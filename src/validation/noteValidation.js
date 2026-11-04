import Joi from "joi";
import { NOTE_COLORS } from "../models/noteModel.js";

const objectId = Joi.string().hex().length(24);

const context = Joi.object({
  type: Joi.string().trim().max(40).allow(""),
  slug: Joi.string().trim().max(160).allow(""),
  title: Joi.string().trim().max(200).allow(""),
  url: Joi.string().trim().max(400).pattern(/^\//).allow(""),
});

export const createNoteSchema = Joi.object({
  title: Joi.string().trim().max(120).allow("").default(""),
  content: Joi.string().trim().min(1).max(5000).required(),
  color: Joi.string().valid(...NOTE_COLORS).default("paper"),
  pinned: Joi.boolean().default(false),
  context: context.optional(),
});

export const updateNoteSchema = Joi.object({
  title: Joi.string().trim().max(120).allow(""),
  content: Joi.string().trim().min(1).max(5000),
  color: Joi.string().valid(...NOTE_COLORS),
  pinned: Joi.boolean(),
}).min(1);

export const bulkDeleteSchema = Joi.object({
  ids: Joi.array().items(objectId).min(1).max(200).unique().required(),
});

export const listNotesSchema = Joi.object({
  q: Joi.string().trim().max(100).allow(""),
  color: Joi.string().valid(...NOTE_COLORS),
  pinned: Joi.string().valid("true", "false"),
  sort: Joi.string().valid("updated", "created", "title").default("updated"),
  order: Joi.string().valid("asc", "desc").default("desc"),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(24),
});

export const noteIdSchema = objectId.required();
