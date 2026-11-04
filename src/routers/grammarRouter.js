import { Router } from "express";
import { listGrammar, getGrammar } from "../controllers/grammarController.js";

const router = Router();
router.get("/", listGrammar);
router.get("/:slug", getGrammar);
export default router;
