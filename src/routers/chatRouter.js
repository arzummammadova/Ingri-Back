import { Router } from "express";
import Joi from "joi";
import { chat, clearHistory, listHistory } from "../controllers/chatController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { chatLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";

const chatSchema = Joi.object({
  message: Joi.string().trim().min(1).max(2000).required(),
  locale: Joi.string().valid("az", "en", "ru").default("az"),
});

const router = Router();
router.use(requireAuth);
router.get("/history", listHistory);
router.delete("/history", clearHistory);
router.post("/", chatLimiter, validate(chatSchema), chat);
export default router;
