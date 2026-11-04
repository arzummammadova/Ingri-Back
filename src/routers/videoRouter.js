import { Router } from "express";
import { getVideo, listVideos } from "../controllers/videoController.js";

const router = Router();
router.get("/", listVideos);
router.get("/:slug", getVideo);
export default router;
