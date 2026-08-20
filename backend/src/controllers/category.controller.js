import * as categoryService from "../services/category.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const list = asyncHandler(async (req, res) => {
  const data = await categoryService.listCategories(req.query);
  res.json({ success: true, data });
});

export const getOne = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategory(req.params.idOrSlug);
  res.json({ success: true, data: category });
});

export const create = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({ success: true, data: category });
});

export const update = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.json({ success: true, data: category });
});

export const remove = asyncHandler(async (req, res) => {
  const category = await categoryService.deleteCategory(req.params.id);
  res.json({ success: true, data: category });
});