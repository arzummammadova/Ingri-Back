import { Router } from "express";
import { listPodcasts, getPodcast } from "../controllers/podcastController.js";

const router = Router();
router.get("/", listPodcasts);
router.get("/:slug", getPodcast);
export default router;
