import { Router } from "express";
import { createFlashcard, deleteFlashcard, listFlashcards, updateFlashcard } from "../controllers/flashcardController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { notesLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";
import { createFlashcardSchema, updateFlashcardSchema } from "../validation/flashcardValidation.js";

const router = Router();
router.use(requireAuth, notesLimiter);
router.get("/", listFlashcards);
router.post("/", validate(createFlashcardSchema), createFlashcard);
router.patch("/:id", validate(updateFlashcardSchema), updateFlashcard);
router.delete("/:id", deleteFlashcard);
export default router;
