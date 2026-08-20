import { body } from "express-validator";
import { ROLES_LIST } from "../constants/index.js";

export const registerValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("phone").optional({ nullable: true }).trim(),
  body("role")
    .optional()
    .isIn(ROLES_LIST)
    .withMessage(`Role must be one of: ${ROLES_LIST.join(", ")}`),
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Email is invalid").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const refreshValidator = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

export const forgotPasswordValidator = [
  body("email").trim().isEmail().withMessage("Email is invalid").normalizeEmail(),
];

export const resetPasswordValidator = [
  body("token").notEmpty().withMessage("Token is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

export const changePasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters"),
];

export const updateUserValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail(),
  body("phone").optional({ nullable: true }).trim(),
  body("role")
    .optional()
    .isIn(ROLES_LIST)
    .withMessage(`Role must be one of: ${ROLES_LIST.join(", ")}`),
  body("isActive").optional().isBoolean().withMessage("isActive must be boolean"),
  body("avatar").optional({ nullable: true }).trim(),
];