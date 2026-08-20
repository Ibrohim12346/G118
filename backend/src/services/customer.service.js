import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import ApiError from "../utils/ApiError.js";
import { getPagination, buildPagination } from "../utils/pagination.js";

export const listCustomers = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.search) {
    const re = new RegExp(query.search, "i");
    filter.$or = [{ name: re }, { phone: re }, { email: re }];
  }

  const [data, total] = await Promise.all([
    Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Customer.countDocuments(filter),
  ]);
  return { data, pagination: buildPagination(page, limit, total) };
};

export const getCustomerById = async (id) => {
  const customer = await Customer.findById(id);
  if (!customer) throw new ApiError(404, "Customer not found");
  return customer;
};

export const createCustomer = async (data) => {
  return Customer.create(data);
};

export const updateCustomer = async (id, data) => {
  const customer = await Customer.findById(id);
  if (!customer) throw new ApiError(404, "Customer not found");

  if (data.name !== undefined) customer.name = data.name;
  if (data.phone !== undefined) customer.phone = data.phone;
  if (data.email !== undefined) customer.email = data.email;
  if (data.address !== undefined) customer.address = data.address;

  await customer.save();
  return customer;
};

export const deleteCustomer = async (id) => {
  const orderCount = await Order.countDocuments({ customer: id });
  if (orderCount > 0) {
    throw new ApiError(409, "Cannot delete a customer that has orders");
  }
  const customer = await Customer.findByIdAndDelete(id);
  if (!customer) throw new ApiError(404, "Customer not found");
  return customer;
};