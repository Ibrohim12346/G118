import { Router } from "express";
import * as productController from "../controllers/productController.js";
import { protect, requireMinRole } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  productValidator,
  updateProductValidator,
} from "../validators/productValidator.js";
import { ROLES } from "../constants/index.js";

const router = Router();

router.get("/", productController.listProducts);
router.get("/slug/:slug", productController.getProductBySlug);
router.get("/:id", productController.getProduct);

router.post(
  "/",
  protect,
  requireMinRole(ROLES.ADMIN),
  productValidator,
  validate,
  productController.createProduct
);
router.patch(
  "/:id",
  protect,
  requireMinRole(ROLES.ADMIN),
  updateProductValidator,
  validate,
  productController.updateProduct
);
router.delete(
  "/:id",
  protect,
  requireMinRole(ROLES.ADMIN),
  productController.deleteProduct
);

export default router;