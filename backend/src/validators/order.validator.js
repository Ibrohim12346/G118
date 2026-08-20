import { body } from "express-validator";

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];
const ORDER_STATUSES = ["new", "confirmed", "processing", "shipping", "completed", "cancelled"];

export const createOrderValidator = [
  body("customer").isMongoId().withMessage("Invalid customer id"),
  body("items").isArray({ min: 1 }).withMessage("At least one item is required"),
  body("items.*.product").notEmpty().withMessage("Product is required").isMongoId().withMessage("Invalid product id"),
  body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1").toInt(),
  body("discount").optional().isFloat({ min: 0 }).withMessage("Discount must be a non-negative number"),
  body("deliveryPrice").optional().isFloat({ min: 0 }).withMessage("Delivery price must be a non-negative number"),
  body("paymentStatus")
    .optional()
    .isIn(PAYMENT_STATUSES)
    .withMessage(`Payment status must be one of: ${PAYMENT_STATUSES.join(", ")}`),
  body("deliveryAddress")
    .trim()
    .notEmpty()
    .withMessage("Delivery address is required")
    .isLength({ max: 1000 })
    .withMessage("Delivery address must be at most 1000 characters"),
  body("phone").trim().notEmpty().withMessage("Phone is required").isLength({ max: 20 }).withMessage("Phone is too long"),
];

export const updateOrderValidator = [
  body("orderStatus")
    .optional()
    .isIn(ORDER_STATUSES)
    .withMessage(`Order status must be one of: ${ORDER_STATUSES.join(", ")}`),
  body("paymentStatus")
    .optional()
    .isIn(PAYMENT_STATUSES)
    .withMessage(`Payment status must be one of: ${PAYMENT_STATUSES.join(", ")}`),
  body("discount").optional().isFloat({ min: 0 }).withMessage("Discount must be a non-negative number"),
  body("deliveryPrice").optional().isFloat({ min: 0 }).withMessage("Delivery price must be a non-negative number"),
  body("deliveryAddress")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Delivery address is required")
    .isLength({ max: 1000 })
    .withMessage("Delivery address must be at most 1000 characters"),
  body("phone").optional().trim().notEmpty().withMessage("Phone is required").isLength({ max: 20 }).withMessage("Phone is too long"),
];