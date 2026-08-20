import { Category } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { paginationOptions, slugify } from "../utils/helpers.js";
import { assertExists } from "../utils/db.js";

export async function listCategories(query) {
  const { page, limit, skip } = paginationOptions(query);
  const filter = {};

  if (query.isActive !== undefined) filter.isActive = query.isActive === "true";
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { slug: { $regex: query.search, $options: "i" } },
    ];
  }

  const [categories, total] = await Promise.all([
    Category.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Category.countDocuments(filter),
  ]);

  return {
    items: categories,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getCategory(id) {
  return assertExists(Category, id, "Category not found");
}

export async function createCategory(data) {
  const slug = data.slug || slugify(data.name);
  const existing = await Category.findOne({ slug });
  if (existing) {
    throw new ApiError(409, "Slug already exists", { slug: "Slug already exists" });
  }

  return Category.create({ ...data, slug });
}

export async function updateCategory(id, data) {
  const category = await assertExists(Category, id, "Category not found");

  if (data.slug || (!data.slug && data.name && !category.slug)) {
    const slug = data.slug || slugify(data.name);
    const existing = await Category.findOne({ slug, _id: { $ne: id } });
    if (existing) {
      throw new ApiError(409, "Slug already exists", { slug: "Slug already exists" });
    }
    data.slug = slug;
  }

  Object.assign(category, data);
  await category.save();
  return category;
}

export async function deleteCategory(id) {
  const category = await assertExists(Category, id, "Category not found");
  await category.deleteOne();
  return { success: true };
}