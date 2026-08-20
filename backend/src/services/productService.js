import { Product } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { paginationOptions, slugify } from "../utils/helpers.js";
import { assertExists } from "../utils/db.js";

export async function listProducts(query) {
  const { page, limit, skip } = paginationOptions(query);
  const filter = {};

  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;
  if (query.slug) filter.slug = query.slug;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { sku: { $regex: query.search, $options: "i" } },
      { slug: { $regex: query.search, $options: "i" } },
    ];
  }
  if (query.priceMin !== undefined) {
    filter.price = { ...(filter.price || {}), $gte: Number(query.priceMin) };
  }
  if (query.priceMax !== undefined) {
    filter.price = { ...(filter.price || {}), $lte: Number(query.priceMax) };
  }

  const sort = { createdAt: -1 };
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    items: products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getProduct(id) {
  return Product.findById(id)
    .populate("category", "name slug")
    .populate("createdBy", "name email");
}

export async function getProductBySlug(slug) {
  return Product.findOne({ slug })
    .populate("category", "name slug")
    .populate("createdBy", "name email");
}

export async function createProduct(data, actor) {
  const slug = data.slug || slugify(data.name);
  const existing = await Product.findOne({ slug });
  if (existing) {
    throw new ApiError(409, "Slug already exists", { slug: "Slug already exists" });
  }
  if (data.sku) {
    const existingSku = await Product.findOne({ sku: data.sku.toUpperCase() });
    if (existingSku) {
      throw new ApiError(409, "SKU already exists", { sku: "SKU already exists" });
    }
  }

  return Product.create({
    ...data,
    slug,
    sku: data.sku ? data.sku.toUpperCase() : data.sku,
    createdBy: actor._id,
  });
}

export async function updateProduct(id, data) {
  const product = await assertExists(Product, id, "Product not found");

  if (data.sku) {
    const existingSku = await Product.findOne({
      sku: data.sku.toUpperCase(),
      _id: { $ne: id },
    });
    if (existingSku) {
      throw new ApiError(409, "SKU already exists", { sku: "SKU already exists" });
    }
    data.sku = data.sku.toUpperCase();
  }

  if (data.name && !data.slug) {
    const slug = slugify(data.name);
    const existingSlug = await Product.findOne({ slug, _id: { $ne: id } });
    if (existingSlug) {
      throw new ApiError(409, "Slug already exists", { slug: "Slug already exists" });
    }
    data.slug = slug;
  }

  Object.assign(product, data);
  await product.save();
  return product;
}

export async function deleteProduct(id) {
  const product = await assertExists(Product, id, "Product not found");
  await product.deleteOne();
  return { success: true };
}