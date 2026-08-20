import { Router } from "express";
import * as categoryController from "../controllers/categoryController.js";
import { protect, requireMinRole } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  categoryValidator,
  updateCategoryValidator,
} from "../validators/categoryValidator.js";
import { ROLES } from "../constants/index.js";

const router = Router();

router.get("/", categoryController.listCategories);
router.get("/:id", categoryController.getCategory);

router.post(
  "/",
  protect,
  requireMinRole(ROLES.ADMIN),
  categoryValidator,
  validate,
  categoryController.createCategory
);
router.patch(
  "/:id",
  protect,
  requireMinRole(ROLES.ADMIN),
  updateCategoryValidator,
  validate,
  categoryController.updateCategory
);
router.delete(
  "/:id",
  protect,
  requireMinRole(ROLES.ADMIN),
  categoryController.deleteCategory
);

export default router;