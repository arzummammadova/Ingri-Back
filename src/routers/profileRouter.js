import { Router } from "express";
import {
  choosePreset,
  deleteAvatar,
  listPresets,
  savePlan,
  updateActiveLevel,
  updateLevel,
  updateLevels,
  updatePreferences,
  updateProfile,
  uploadAvatar,
} from "../controllers/profileController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { avatarUpload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { activeLevelSchema, levelSchema, levelsSchema, planSchema, preferencesSchema, presetSchema, profileSchema } from "../validation/profileValidation.js";

const router = Router();
router.use(requireAuth);
router.get("/presets", listPresets);
router.patch("/level", validate(levelSchema), updateLevel);
router.patch("/levels", validate(levelsSchema), updateLevels);
router.patch("/active-level", validate(activeLevelSchema), updateActiveLevel);
router.put("/plan", validate(planSchema), savePlan);
router.patch("/preferences", validate(preferencesSchema), updatePreferences);
router.patch("/", validate(profileSchema), updateProfile);
router.post("/avatar", avatarUpload, uploadAvatar);
router.post("/avatar/preset", validate(presetSchema), choosePreset);
router.delete("/avatar", deleteAvatar);
export default router;
