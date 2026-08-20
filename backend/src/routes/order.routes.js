import { Router } from "express";
import * as orderController from "../controllers/orderController.js";
import { protect, requireMinRole } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { orderValidator, updateOrderValidator } from "../validators/orderValidator.js";
import { ROLES } from "../constants/index.js";

const router = Router();

router.post(
  "/",
  orderValidator,
  validate,
  orderController.createOrder
);

router.use(protect, requireMinRole(ROLES.SELLER));

router.get("/", orderController.listOrders);
router.get("/:id", orderController.getOrder);
router.patch(
  "/:id",
  updateOrderValidator,
  validate,
  orderController.updateOrder
);
router.post("/:id/cancel", orderController.cancelOrder);
router.delete("/:id", orderController.deleteOrder);

export default router;