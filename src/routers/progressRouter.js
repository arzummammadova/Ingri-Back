import { Router } from "express";
import {
  getProgress,
  saveListening,
  savePodcast,
  saveQuiz,
  saveSpeaking,
  toggleFavorite,
  savePodcastQuiz,
  saveTask,
  saveTime,
  saveWatch,
  saveWord,
  saveItem,
  getSummary,
} from "../controllers/progressController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  listeningSchema,
  favoriteSchema,
  podcastProgressSchema,
  podcastQuizSchema,
  quizSchema,
  speakingSchema,
  taskSchema,
  timeSchema,
  watchSchema,
  wordSchema,
  itemSchema,
} from "../validation/progressValidation.js";

const router = Router();
router.use(requireAuth);
router.get("/", getProgress);
router.get("/summary", getSummary);
router.post("/item", validate(itemSchema), saveItem);
router.post("/podcast", validate(podcastProgressSchema), savePodcast);
router.post("/quiz", validate(quizSchema), saveQuiz);
router.post("/listening", validate(listeningSchema), saveListening);
router.post("/speaking", validate(speakingSchema), saveSpeaking);
router.post("/word", validate(wordSchema), saveWord);
router.post("/podcast-quiz", validate(podcastQuizSchema), savePodcastQuiz);
router.post("/time", validate(timeSchema), saveTime);
router.post("/watch", validate(watchSchema), saveWatch);
router.post("/favorite", validate(favoriteSchema), toggleFavorite);
router.post("/task", validate(taskSchema), saveTask);
export default router;
