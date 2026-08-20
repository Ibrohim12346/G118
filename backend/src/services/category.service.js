import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import { getPagination, buildPagination } from "../utils/pagination.js";
import { slugify } from "../utils/generate.js";

const buildUniqueSlug = async (base, excludeId = null) => {
  let slug = base;
  let n = 1;
  while (await Category.findOne({ slug, _id: { $ne: excludeId } })) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
};

export const listCategories = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};
  if (query.isActive !== undefined && query.isActive !== "") {
    filter.isActive = query.isActive === "true";
  }

  const [data, total] = await Promise.all([
    Category.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
    Category.countDocuments(filter),
  ]);
  return { data, pagination: buildPagination(page, limit, total) };
};

export const getCategory = async (idOrSlug) => {
  const filter = mongoose.isValidObjectId(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };
  const category = await Category.findOne(filter);
  if (!category) throw new ApiError(404, "Category not found");
  return category;
};

export const createCategory = async (data) => {
  const slug = data.slug
    ? slugify(data.slug)
    : await buildUniqueSlug(slugify(data.name));
  return Category.create({ ...data, slug });
};

export const updateCategory = async (id, data) => {
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, "Category not found");

  if (data.name !== undefined && data.name !== category.name) {
    category.name = data.name;
    if (!data.slug) category.slug = await buildUniqueSlug(slugify(data.name), id);
  }
  if (data.slug) {
    const slug = slugify(data.slug);
    const dup = await Category.findOne({ slug, _id: { $ne: id } });
    if (dup) throw new ApiError(409, "Slug already in use", { slug: "Slug already in use" });
    category.slug = slug;
  }
  if (data.description !== undefined) category.description = data.description;
  if (data.image !== undefined) category.image = data.image;
  if (data.isActive !== undefined) category.isActive = data.isActive;

  await category.save();
  return category;
};

export const deleteCategory = async (id) => {
  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    throw new ApiError(409, "Cannot delete a category that has products");
  }
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new ApiError(404, "Category not found");
  return category;
};