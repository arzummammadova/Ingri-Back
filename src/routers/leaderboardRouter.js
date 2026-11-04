import { Router } from "express";
import { getLeader, listLeaderboard } from "../controllers/leaderboardController.js";

const router = Router();
router.get("/", listLeaderboard);
router.get("/:id", getLeader);
export default router;
