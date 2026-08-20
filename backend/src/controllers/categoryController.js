import { catchAsync } from "../utils/catchAsync.js";
import * as categoryService from "../services/categoryService.js";

export const listCategories = catchAsync(async (req, res) => {
  const data = await categoryService.listCategories(req.query);
  res.status(200).json({ success: true, data });
});

export const getCategory = catchAsync(async (req, res) => {
  const data = await categoryService.getCategory(req.params.id);
  res.status(200).json({ success: true, data });
});

export const createCategory = catchAsync(async (req, res) => {
  const data = await categoryService.createCategory(req.body);
  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data,
  });
});

export const updateCategory = catchAsync(async (req, res) => {
  const data = await categoryService.updateCategory(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data,
  });
});

export const deleteCategory = catchAsync(async (req, res) => {
  const data = await categoryService.deleteCategory(req.params.id);
  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data,
  });
});