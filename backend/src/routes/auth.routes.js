import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  loginValidator,
  registerValidator,
  refreshValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
} from "../validators/authValidator.js";

const router = Router();

router.post("/register", registerValidator, validate, authController.register);
router.post("/login", loginValidator, validate, authController.login);
router.post("/refresh", refreshValidator, validate, authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", protect, authController.me);
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  validate,
  authController.forgotPassword
);
router.post(
  "/reset-password",
  resetPasswordValidator,
  validate,
  authController.resetPassword
);
router.post(
  "/change-password",
  protect,
  changePasswordValidator,
  validate,
  authController.changePassword
);

export default router;