import { body } from "express-validator";

const passwordRule = () =>
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters");

export const registerValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  passwordRule(),
  body("phone").optional({ nullable: true }).trim().isLength({ max: 20 }).withMessage("Phone is too long"),
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const refreshValidator = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

export const forgotPasswordValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required").normalizeEmail(),
];

export const resetPasswordValidator = [
  body("token").notEmpty().withMessage("Reset token is required"),
  passwordRule(),
];

export const changePasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  passwordRule(),
];