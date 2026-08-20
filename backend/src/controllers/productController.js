import { catchAsync } from "../utils/catchAsync.js";
import * as productService from "../services/productService.js";

export const listProducts = catchAsync(async (req, res) => {
  const data = await productService.listProducts(req.query);
  res.status(200).json({ success: true, data });
});

export const getProduct = catchAsync(async (req, res) => {
  const data = await productService.getProduct(req.params.id);
  if (!data) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  return res.status(200).json({ success: true, data });
});

export const getProductBySlug = catchAsync(async (req, res) => {
  const data = await productService.getProductBySlug(req.params.slug);
  if (!data) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  return res.status(200).json({ success: true, data });
});

export const createProduct = catchAsync(async (req, res) => {
  const data = await productService.createProduct(req.body, req.user);
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data,
  });
});

export const updateProduct = catchAsync(async (req, res) => {
  const data = await productService.updateProduct(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data,
  });
});

export const deleteProduct = catchAsync(async (req, res) => {
  const data = await productService.deleteProduct(req.params.id);
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data,
  });
});