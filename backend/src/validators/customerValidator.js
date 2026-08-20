import { body, param } from "express-validator";

export const customerValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("phone")
    .trim()
    .matches(/^\+?[0-9\s\-()]{7,20}$/)
    .withMessage("Phone is invalid"),
  body("email")
    .optional({ nullable: true })
    .trim()
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail(),
  body("address")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Address must be at most 500 characters"),
];

export const updateCustomerValidator = [
  param("id").isMongoId().withMessage("Invalid customer id"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("phone")
    .optional()
    .trim()
    .matches(/^\+?[0-9\s\-()]{7,20}$/)
    .withMessage("Phone is invalid"),
  body("email")
    .optional({ nullable: true })
    .trim()
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail(),
  body("address")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Address must be at most 500 characters"),
];