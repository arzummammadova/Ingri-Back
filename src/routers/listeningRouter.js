import { Router } from "express";
import { listListening, getListening } from "../controllers/listeningController.js";

const router = Router();
router.get("/", listListening);
router.get("/:slug", getListening);
export default router;
