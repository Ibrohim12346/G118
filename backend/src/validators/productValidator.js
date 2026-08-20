import { body, param } from "express-validator";
import { PRODUCT_STATUSES } from "../constants/index.js";

export const productValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Name must be between 2 and 200 characters"),
  body("slug")
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Slug must contain only lowercase letters, numbers and hyphens"),
  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Description must be at most 5000 characters"),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("images.*").optional().trim(),
  body("category").isMongoId().withMessage("Category id is invalid"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0"),
  body("wholesalePrice")
    .isFloat({ min: 0 })
    .withMessage("Wholesale price must be greater than or equal to 0")
    .custom((value, { req }) => value <= req.body.price)
    .withMessage("Wholesale price must not be greater than price"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be greater than or equal to 0"),
  body("sku")
    .trim()
    .isLength({ min: 3, max: 64 })
    .withMessage("SKU must be between 3 and 64 characters"),
  body("status")
    .optional()
    .isIn(PRODUCT_STATUSES)
    .withMessage(`Status must be one of: ${PRODUCT_STATUSES.join(", ")}`),
];

export const updateProductValidator = [
  param("id").isMongoId().withMessage("Invalid product id"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Name must be between 2 and 200 characters"),
  body("slug")
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Slug must contain only lowercase letters, numbers and hyphens"),
  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Description must be at most 5000 characters"),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("images.*").optional().trim(),
  body("category").optional().isMongoId().withMessage("Category id is invalid"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0"),
  body("wholesalePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Wholesale price must be greater than or equal to 0")
    .custom((value, { req }) => {
      if (req.body.price !== undefined && value > req.body.price) {
        throw new Error("Wholesale price must not be greater than price");
      }
      return true;
    }),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be greater than or equal to 0"),
  body("sku")
    .optional()
    .trim()
    .isLength({ min: 3, max: 64 })
    .withMessage("SKU must be between 3 and 64 characters"),
  body("status")
    .optional()
    .isIn(PRODUCT_STATUSES)
    .withMessage(`Status must be one of: ${PRODUCT_STATUSES.join(", ")}`),
];