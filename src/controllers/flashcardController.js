import Flashcard from "../models/flashcardModel.js";
import { HttpError } from "../utils/httpError.js";
import { flashcardIdSchema } from "../validation/flashcardValidation.js";

const MAX_CARDS = 2000;

function checkId(id) {
  if (flashcardIdSchema.validate(id).error) throw new HttpError(400, "VALIDATION");
}

export async function listFlashcards(req, res, next) {
  try {
    const items = await Flashcard.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(MAX_CARDS).lean();
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

export async function createFlashcard(req, res, next) {
  try {
    const count = await Flashcard.countDocuments({ user: req.user._id });
    if (count >= MAX_CARDS) throw new HttpError(400, "LIMIT");
    const item = await Flashcard.create({ ...req.body, user: req.user._id });
    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
}

export async function updateFlashcard(req, res, next) {
  try {
    checkId(req.params.id);
    const item = await Flashcard.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $set: req.body }, { new: true, runValidators: true }).lean();
    if (!item) throw new HttpError(404, "NOT_FOUND");
    res.json({ item });
  } catch (error) {
    next(error);
  }
}

export async function deleteFlashcard(req, res, next) {
  try {
    checkId(req.params.id);
    const result = await Flashcard.deleteOne({ _id: req.params.id, user: req.user._id });
    if (!result.deletedCount) throw new HttpError(404, "NOT_FOUND");
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
}
