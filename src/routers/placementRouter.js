import { Router } from "express";
import { getPlacement, scorePlacement } from "../controllers/placementController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();
router.use(requireAuth);
router.get("/", getPlacement);
router.post("/", scorePlacement);
export default router;
