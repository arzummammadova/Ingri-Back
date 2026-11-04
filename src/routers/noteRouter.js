import { Router } from "express";
import { bulkDeleteNotes, createNote, deleteNote, listNotes, togglePin, updateNote } from "../controllers/noteController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { notesLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";
import { bulkDeleteSchema, createNoteSchema, updateNoteSchema } from "../validation/noteValidation.js";

const router = Router();
router.use(requireAuth, notesLimiter);
router.get("/", listNotes);
router.post("/", validate(createNoteSchema), createNote);
router.post("/bulk-delete", validate(bulkDeleteSchema), bulkDeleteNotes);
router.patch("/:id", validate(updateNoteSchema), updateNote);
router.patch("/:id/pin", togglePin);
router.delete("/:id", deleteNote);
export default router;
