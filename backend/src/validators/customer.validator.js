import { body } from "express-validator";

export const createCustomerValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ max: 20 })
    .withMessage("Phone is too long"),
  body("email")
    .optional({ nullable: true })
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("address")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Address must be at most 500 characters"),
];

export const updateCustomerValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("phone")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ max: 20 })
    .withMessage("Phone is too long"),
  body("email")
    .optional({ nullable: true })
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("address")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Address must be at most 500 characters"),
];