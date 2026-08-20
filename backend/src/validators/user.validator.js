import { body } from "express-validator";

const ROLES = ["superadmin", "admin", "manager", "seller"];

const nameRule = () =>
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters");

const phoneRule = () =>
  body("phone").optional({ nullable: true }).trim().isLength({ max: 20 }).withMessage("Phone is too long");

export const updateProfileValidator = [
  nameRule(),
  phoneRule(),
  body("avatar").optional({ nullable: true }).trim().isLength({ max: 500 }).withMessage("Avatar URL is too long"),
];

export const createUserValidator = [
  nameRule(),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  phoneRule(),
  body("role").optional().isIn(ROLES).withMessage(`Role must be one of: ${ROLES.join(", ")}`),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean").toBoolean(),
];

export const updateUserValidator = [
  nameRule(),
  phoneRule(),
  body("role").optional().isIn(ROLES).withMessage(`Role must be one of: ${ROLES.join(", ")}`),
  body("isActive").optional().isBoolean().withMessage("isActive must be a boolean").toBoolean(),
  body("avatar").optional({ nullable: true }).trim().isLength({ max: 500 }).withMessage("Avatar URL is too long"),
  body("password").optional().isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];