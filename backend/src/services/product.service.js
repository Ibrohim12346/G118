import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import ApiError from "../utils/ApiError.js";
import { getPagination, buildPagination } from "../utils/pagination.js";
import { slugify } from "../utils/generate.js";

const buildUniqueSlug = async (base, excludeId = null) => {
  let slug = base;
  let n = 1;
  while (await Product.findOne({ slug, _id: { $ne: excludeId } })) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
};

export const listProducts = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;
  if (query.search) filter.name = new RegExp(query.search, "i");
  if (query.minPrice !== undefined && query.minPrice !== "") {
    filter.price = { $gte: parseFloat(query.minPrice) };
  }
  if (query.maxPrice !== undefined && query.maxPrice !== "") {
    filter.price = { ...(filter.price || {}), $lte: parseFloat(query.maxPrice) };
  }
  if (query.inStock === "true") filter.stock = { $gt: 0 };

  const sort = query.sort || "-createdAt";
  const [data, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);
  return { data, pagination: buildPagination(page, limit, total) };
};

export const getProduct = async (idOrSlug) => {
  const filter = mongoose.isValidObjectId(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };
  const product = await Product.findOne(filter).populate("category", "name slug");
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

export const createProduct = async (data, userId) => {
  const sku = data.sku.toUpperCase().trim();
  const skuDup = await Product.findOne({ sku });
  if (skuDup) throw new ApiError(409, "SKU already in use", { sku: "SKU already in use" });

  const category = await Category.findById(data.category);
  if (!category) throw new ApiError(400, "Invalid category", { category: "Category does not exist" });

  const baseSlug = data.slug ? slugify(data.slug) : slugify(data.name);
  const slug = await buildUniqueSlug(baseSlug || `product-${sku.toLowerCase()}`);

  return Product.create({ ...data, sku, slug, createdBy: userId });
};

export const updateProduct = async (id, data) => {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  if (data.name !== undefined) {
    product.name = data.name;
    if (!data.slug) product.slug = await buildUniqueSlug(slugify(data.name), id);
  }
  if (data.slug) {
    const slug = slugify(data.slug);
    const dup = await Product.findOne({ slug, _id: { $ne: id } });
    if (dup) throw new ApiError(409, "Slug already in use", { slug: "Slug already in use" });
    product.slug = slug;
  }
  if (data.sku !== undefined) {
    const sku = data.sku.toUpperCase().trim();
    const dup = await Product.findOne({ sku, _id: { $ne: id } });
    if (dup) throw new ApiError(409, "SKU already in use", { sku: "SKU already in use" });
    product.sku = sku;
  }
  if (data.category !== undefined) {
    const category = await Category.findById(data.category);
    if (!category) throw new ApiError(400, "Invalid category", { category: "Category does not exist" });
    product.category = data.category;
  }
  if (data.description !== undefined) product.description = data.description;
  if (data.images !== undefined) product.images = data.images;
  if (data.price !== undefined) product.price = data.price;
  if (data.wholesalePrice !== undefined) product.wholesalePrice = data.wholesalePrice;
  if (data.stock !== undefined) product.stock = data.stock;
  if (data.status !== undefined) product.status = data.status;

  await product.save();
  return product;
};

export const deleteProduct = async (id) => {
  const orderCount = await Order.countDocuments({ "items.product": id });
  if (orderCount > 0) {
    throw new ApiError(409, "Cannot delete a product referenced by orders");
  }
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};