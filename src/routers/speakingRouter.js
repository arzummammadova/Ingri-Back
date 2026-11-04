import { Router } from "express";
import { listSpeaking, getSpeaking } from "../controllers/speakingController.js";

const router = Router();
router.get("/", listSpeaking);
router.get("/:slug", getSpeaking);
export default router;
