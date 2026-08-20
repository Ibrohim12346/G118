import { body } from "express-validator";

const STATUSES = ["active", "inactive", "out_of_stock"];

export const createProductValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Name must be between 2 and 200 characters"),
  body("slug").optional().trim().isLength({ max: 200 }).withMessage("Slug is too long"),
  body("description").optional().trim().isLength({ max: 5000 }).withMessage("Description must be at most 5000 characters"),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("images.*").trim().isString().withMessage("Each image must be a string"),
  body("category").isMongoId().withMessage("Invalid category id"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),
  body("wholesalePrice").isFloat({ min: 0 }).withMessage("Wholesale price must be a non-negative number"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer").toInt(),
  body("sku").trim().notEmpty().withMessage("SKU is required").isLength({ max: 100 }).withMessage("SKU is too long"),
  body("status").optional().isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(", ")}`),
];

export const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Name must be between 2 and 200 characters"),
  body("slug").optional().trim().isLength({ max: 200 }).withMessage("Slug is too long"),
  body("description").optional().trim().isLength({ max: 5000 }).withMessage("Description must be at most 5000 characters"),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("images.*").trim().isString().withMessage("Each image must be a string"),
  body("category").optional().isMongoId().withMessage("Invalid category id"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a non-negative number"),
  body("wholesalePrice").optional().isFloat({ min: 0 }).withMessage("Wholesale price must be a non-negative number"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer").toInt(),
  body("sku").optional().trim().notEmpty().withMessage("SKU is required").isLength({ max: 100 }).withMessage("SKU is too long"),
  body("status").optional().isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(", ")}`),
];