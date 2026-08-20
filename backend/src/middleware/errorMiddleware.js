import mongoose from "mongoose";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

function mongooseValidationError(err) {
  const errors = {};
  for (const [path, error] of Object.entries(err.errors || {})) {
    errors[path] = error.message || "Invalid value";
  }
  return { statusCode: 400, message: "Validation failed", errors };
}

function duplicateKeyError(err) {
  const key = Object.keys(err.keyValue || {})[0];
  return {
    statusCode: 409,
    message: "Duplicate value",
    errors: { [key || "field"]: `${key || "Field"} already exists` },
  };
}

function castError(err) {
  return {
    statusCode: 400,
    message: "Invalid value",
    errors: { [err.path]: `${err.value} is not a valid ${err.kind}` },
  };
}

export function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorMiddleware(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.details;

  if (err instanceof mongoose.Error.ValidationError) {
    ({ statusCode, message, errors } = mongooseValidationError(err));
  } else if (err.code === 11000) {
    ({ statusCode, message, errors } = duplicateKeyError(err));
  } else if (err instanceof mongoose.Error.CastError) {
    ({ statusCode, message, errors } = castError(err));
  } else if (err instanceof mongoose.Error) {
    statusCode = 400;
    message = err.message;
  }

  if (statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);
  }

  if (env.nodeEnv === "production" && statusCode >= 500) {
    message = "Internal Server Error";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
}