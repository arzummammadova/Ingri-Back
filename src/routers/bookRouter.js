import { Router } from "express";
import { getBook, listBooks } from "../controllers/bookController.js";

const router = Router();
router.get("/", listBooks);
router.get("/:slug", getBook);
export default router;
