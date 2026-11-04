import { Router } from "express";
import { exportWords, getWord, listWords, lookupWord } from "../controllers/wordController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();
router.get("/lookup", lookupWord);
router.get("/export.pdf", requireAuth, exportWords);
router.get("/", listWords);
router.get("/:slug", getWord);
export default router;
