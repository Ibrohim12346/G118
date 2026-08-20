import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  registerValidator,
  updateUserValidator,
} from "../validators/authValidator.js";
import { ROLES } from "../constants/index.js";

const router = Router();

router.use(protect, requireRole(ROLES.SUPERADMIN));

router.get("/", userController.listUsers);
router.post("/", registerValidator, validate, userController.createUser);
router.get("/:id", userController.getUser);
router.patch("/:id", updateUserValidator, validate, userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;