import { Router } from "express";
import * as customerController from "../controllers/customerController.js";
import { protect, requireMinRole } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  customerValidator,
  updateCustomerValidator,
} from "../validators/customerValidator.js";
import { ROLES } from "../constants/index.js";

const router = Router();

router.use(protect, requireMinRole(ROLES.MANAGER));

router.get("/", customerController.listCustomers);
router.post("/", customerValidator, validate, customerController.createCustomer);
router.get("/:id", customerController.getCustomer);
router.patch(
  "/:id",
  updateCustomerValidator,
  validate,
  customerController.updateCustomer
);
router.delete("/:id", customerController.deleteCustomer);

export default router;