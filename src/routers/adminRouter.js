import { Router } from "express";
import { adminStats } from "../controllers/adminController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();
router.get("/stats", requireAuth, isAdmin, adminStats);
export default router;
