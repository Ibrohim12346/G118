import { Router } from "express";
import * as statsController from "../controllers/stats.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticate, authorize("superadmin", "admin", "manager"));

router.get("/", statsController.getStats);
router.get("/sales", statsController.sales);
router.get("/top-products", statsController.topProducts);

export default router;