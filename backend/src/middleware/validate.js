import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = {};
  for (const error of result.array()) {
    if (!errors[error.path]) {
      errors[error.path] = error.msg;
    }
  }

  return next(new ApiError(400, "Validation failed", errors));
}