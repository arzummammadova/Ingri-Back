import Note from "../models/noteModel.js";
import { HttpError } from "../utils/httpError.js";
import { listNotesSchema, noteIdSchema } from "../validation/noteValidation.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function checkId(id) {
  const { error } = noteIdSchema.validate(id);
  if (error) throw new HttpError(400, "VALIDATION");
}

export async function listNotes(req, res, next) {
  try {
    const { error, value } = listNotesSchema.validate(req.query, { stripUnknown: true });
    if (error) throw new HttpError(400, "VALIDATION");
    const filter = { user: req.user._id };
    if (value.color) filter.color = value.color;
    if (value.pinned) filter.pinned = value.pinned === "true";
    if (value.q) {
      const rx = new RegExp(escapeRegex(value.q), "i");
      filter.$or = [{ title: rx }, { content: rx }];
    }
    const dir = value.order === "asc" ? 1 : -1;
    const field = { updated: "updatedAt", created: "createdAt", title: "title" }[value.sort];
    const [items, total] = await Promise.all([
      Note.find(filter)
        .sort({ pinned: -1, [field]: dir, _id: dir })
        .skip((value.page - 1) * value.limit)
        .limit(value.limit)
        .lean(),
      Note.countDocuments(filter),
    ]);
    res.json({ items, total, page: value.page, pages: Math.max(1, Math.ceil(total / value.limit)) });
  } catch (error) {
    next(error);
  }
}

export async function createNote(req, res, next) {
  try {
    const item = await Note.create({ ...req.body, user: req.user._id });
    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
}

export async function updateNote(req, res, next) {
  try {
    checkId(req.params.id);
    const item = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $set: req.body }, { new: true, runValidators: true });
    if (!item) throw new HttpError(404, "NOT_FOUND");
    res.json({ item });
  } catch (error) {
    next(error);
  }
}

export async function togglePin(req, res, next) {
  try {
    checkId(req.params.id);
    const item = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) throw new HttpError(404, "NOT_FOUND");
    item.pinned = !item.pinned;
    await item.save();
    res.json({ item });
  } catch (error) {
    next(error);
  }
}

export async function deleteNote(req, res, next) {
  try {
    checkId(req.params.id);
    const result = await Note.deleteOne({ _id: req.params.id, user: req.user._id });
    if (!result.deletedCount) throw new HttpError(404, "NOT_FOUND");
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}

export async function bulkDeleteNotes(req, res, next) {
  try {
    const result = await Note.deleteMany({ _id: { $in: req.body.ids }, user: req.user._id });
    res.json({ ok: true, deleted: result.deletedCount });
  } catch (error) {
    next(error);
  }
}
