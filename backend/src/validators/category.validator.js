import { body } from "express-validator";

const nameRule = () =>
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters");

export const createCategoryValidator = [
  nameRule(),
  body("slug").optional().trim().isLength({ max: 100 }).withMessage("Slug is too long"),
  body("description").optional().trim().isLength({ max: 1000 }).withMessage("Description must be at most 1000 characters"),
  body("image").optional({ nullable: true }).trim().isLength({ max: 500 }).withMessage("Image URL is too long"),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean").toBoolean(),
];

export const updateCategoryValidator = [
  nameRule(),
  body("slug").optional().trim().isLength({ max: 100 }).withMessage("Slug is too long"),
  body("description").optional().trim().isLength({ max: 1000 }).withMessage("Description must be at most 1000 characters"),
  body("image").optional({ nullable: true }).trim().isLength({ max: 500 }).withMessage("Image URL is too long"),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean").toBoolean(),
];