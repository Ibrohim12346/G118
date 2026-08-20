import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export function isValidObjectId(value, fieldName = "id") {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(400, `${fieldName} is not a valid ObjectId`);
  }
  return value;
}

export async function assertExists(Model, id, message = "Resource not found") {
  isValidObjectId(id);
  const doc = await Model.findById(id);
  if (!doc) throw new ApiError(404, message);
  return doc;
}