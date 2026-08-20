import { body, param } from "express-validator";

export const categoryValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("slug")
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Slug must contain only lowercase letters, numbers and hyphens"),
  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be at most 1000 characters"),
  body("image").optional({ nullable: true }).trim(),
  body("isActive").optional().isBoolean().withMessage("isActive must be boolean"),
];

export const updateCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category id"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("slug")
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Slug must contain only lowercase letters, numbers and hyphens"),
  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be at most 1000 characters"),
  body("image").optional({ nullable: true }).trim(),
  body("isActive").optional().isBoolean().withMessage("isActive must be boolean"),
];