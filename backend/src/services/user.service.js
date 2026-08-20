import User from "../models/User.js";
import Session from "../models/Session.js";
import ApiError from "../utils/ApiError.js";
import { getPagination, buildPagination } from "../utils/pagination.js";

export const listUsers = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.role) filter.role = query.role;
  if (query.isActive !== undefined && query.isActive !== "") {
    filter.isActive = query.isActive === "true";
  }
  if (query.search) {
    const re = new RegExp(query.search, "i");
    filter.$or = [{ name: re }, { email: re }];
  }

  const [data, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  return { data, pagination: buildPagination(page, limit, total) };
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

export const createUser = async (data) => {
  const email = data.email.toLowerCase().trim();
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "Email already registered", {
      email: "Email already registered",
    });
  }
  return User.create({ ...data, email });
};

export const updateUser = async (id, data) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");

  if (data.name !== undefined) user.name = data.name;
  if (data.phone !== undefined) user.phone = data.phone;
  if (data.role !== undefined) user.role = data.role;
  if (data.avatar !== undefined) user.avatar = data.avatar;
  if (data.isActive !== undefined) user.isActive = data.isActive;
  if (data.password) user.password = data.password;

  await user.save();
  return user;
};

export const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  if (data.name !== undefined) user.name = data.name;
  if (data.phone !== undefined) user.phone = data.phone;
  if (data.avatar !== undefined) user.avatar = data.avatar;

  await user.save();
  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new ApiError(404, "User not found");
  await Session.deleteMany({ user: id });
  return user;
};