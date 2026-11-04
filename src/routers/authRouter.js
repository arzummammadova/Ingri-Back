import { Router } from "express";
import {
  changePassword,
  csrf,
  deleteAccount,
  forgotPassword,
  login,
  usernameAvailable,
  logout,
  me,
  refresh,
  register,
  resendVerification,
  resetPassword,
  verifyEmail,
} from "../controllers/authController.js";
import { googleCallback, googleStart } from "../controllers/googleAuth.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { loginLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";
import {
  changePasswordSchema,
  deleteAccountSchema,
  emailSchema,
  loginSchema,
  registerSchema,
  resetSchema,
  tokenSchema,
} from "../validation/authValidation.js";

const router = Router();

router.get("/csrf", csrf);
router.get("/google", googleStart);
router.get("/username-available", usernameAvailable);
router.get("/google/callback", googleCallback);
router.post("/register", validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.post("/verify-email", validate(tokenSchema), verifyEmail);
router.post("/resend-verification", validate(emailSchema), resendVerification);
router.post("/forgot-password", validate(emailSchema), forgotPassword);
router.post("/reset-password", validate(resetSchema), resetPassword);
router.post("/change-password", requireAuth, validate(changePasswordSchema), changePassword);
router.delete("/account", requireAuth, validate(deleteAccountSchema), deleteAccount);

export default router;
