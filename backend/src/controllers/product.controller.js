import * as productService from "../services/product.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const list = asyncHandler(async (req, res) => {
  const data = await productService.listProducts(req.query);
  res.json({ success: true, data });
});

export const getOne = asyncHandler(async (req, res) => {
  const product = await productService.getProduct(req.params.idOrSlug);
  res.json({ success: true, data: product });
});

export const create = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user._id);
  res.status(201).json({ success: true, data: product });
});

export const update = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.json({ success: true, data: product });
});

export const remove = asyncHandler(async (req, res) => {
  const product = await productService.deleteProduct(req.params.id);
  res.json({ success: true, data: product });
});