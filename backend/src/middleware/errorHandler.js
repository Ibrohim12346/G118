import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

const normalizeMessage = (error) => {
  const match = /^Path `(\w+)` is required\.$/.exec(error.message);
  if (match) {
    const field = match[1];
    return `${field.charAt(0).toUpperCase()}${field.slice(1)} is required`;
  }
  return error.message;
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || null;

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";
    errors = {};
    for (const [field, e] of Object.entries(err.errors)) {
      errors[field] = normalizeMessage(e);
    }
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid value for field \`${err.path}\``;
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value for ${field}`;
    errors = { [field]: `${field} already exists` };
  } else if (err.code === 121) {
    statusCode = 400;
    message = "Document validation failed";
  }

  if (statusCode >= 500 && !err.isOperational) {
    console.error(err);
  }

  const response = { success: false, message };
  if (errors) response.errors = errors;
  if (process.env.NODE_ENV === "development" && statusCode >= 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};