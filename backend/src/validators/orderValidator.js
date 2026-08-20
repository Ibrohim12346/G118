import { body, param } from "express-validator";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "../constants/index.js";

export const orderValidator = [
  body("customer").isMongoId().withMessage("Customer id is invalid"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),
  body("items.*.product")
    .isMongoId()
    .withMessage("Product id is invalid"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("discount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount must be greater than or equal to 0"),
  body("deliveryPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Delivery price must be greater than or equal to 0"),
  body("deliveryAddress")
    .trim()
    .isLength({ min: 3, max: 1000 })
    .withMessage("Delivery address must be between 3 and 1000 characters"),
  body("phone")
    .trim()
    .matches(/^\+?[0-9\s\-()]{7,20}$/)
    .withMessage("Phone is invalid"),
  body("paymentStatus")
    .optional()
    .isIn(PAYMENT_STATUSES)
    .withMessage(`Payment status must be one of: ${PAYMENT_STATUSES.join(", ")}`),
  body("orderStatus")
    .optional()
    .isIn(ORDER_STATUSES)
    .withMessage(`Order status must be one of: ${ORDER_STATUSES.join(", ")}`),
];

export const updateOrderValidator = [
  param("id").isMongoId().withMessage("Invalid order id"),
  body("orderStatus")
    .optional()
    .isIn(ORDER_STATUSES)
    .withMessage(`Order status must be one of: ${ORDER_STATUSES.join(", ")}`),
  body("paymentStatus")
    .optional()
    .isIn(PAYMENT_STATUSES)
    .withMessage(`Payment status must be one of: ${PAYMENT_STATUSES.join(", ")}`),
  body("discount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount must be greater than or equal to 0"),
  body("deliveryPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Delivery price must be greater than or equal to 0"),
];