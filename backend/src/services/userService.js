import { User } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { paginationOptions } from "../utils/helpers.js";
import { assertExists } from "../utils/db.js";

function serializeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone ?? null,
    role: user.role,
    avatar: user.avatar ?? null,
    isActive: user.isActive,
    lastLogin: user.lastLogin ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function listUsers(query) {
  const { page, limit, skip } = paginationOptions(query);
  const filter = {};

  if (query.role) filter.role = query.role;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }
  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true";
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    items: users.map(serializeUser),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getUser(id) {
  const user = await assertExists(User, id, "User not found");
  return serializeUser(user);
}

export async function createUser(data, actor) {
  if (data.email) {
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new ApiError(409, "Email already exists", { email: "Email already exists" });
    }
  }

  const user = await User.create({
    ...data,
    createdBy: actor?._id,
  });

  return serializeUser(user);
}

export async function updateUser(id, data) {
  if (data.email) {
    const existing = await User.findOne({ email: data.email, _id: { $ne: id } });
    if (existing) {
      throw new ApiError(409, "Email already exists", { email: "Email already exists" });
    }
  }

  const user = await assertExists(User, id, "User not found");

  if (data.password) {
    user.password = data.password;
    delete data.password;
  }

  Object.assign(user, data);
  await user.save();

  return serializeUser(user);
}

export async function deleteUser(id) {
  const user = await assertExists(User, id, "User not found");
  await user.deleteOne();
  return { success: true };
}