import { Customer } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import { paginationOptions } from "../utils/helpers.js";
import { assertExists } from "../utils/db.js";

export async function listCustomers(query) {
  const { page, limit, skip } = paginationOptions(query);
  const filter = {};

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { phone: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  const [customers, total] = await Promise.all([
    Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Customer.countDocuments(filter),
  ]);

  return {
    items: customers,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getCustomer(id) {
  return assertExists(Customer, id, "Customer not found");
}

export async function getOrCreateCustomerByPhone({ name, phone, email, address }) {
  let customer = await Customer.findOne({ phone });
  if (!customer) {
    customer = await Customer.create({
      name,
      phone,
      email: email || null,
      address: address || "",
    });
  }
  return customer;
}

export async function createCustomer(data) {
  const existing = await Customer.findOne({ phone: data.phone });
  if (existing) {
    throw new ApiError(409, "Phone already exists", { phone: "Phone already exists" });
  }
  return Customer.create(data);
}

export async function updateCustomer(id, data) {
  const customer = await assertExists(Customer, id, "Customer not found");
  if (data.phone) {
    const existing = await Customer.findOne({ phone: data.phone, _id: { $ne: id } });
    if (existing) {
      throw new ApiError(409, "Phone already exists", { phone: "Phone already exists" });
    }
  }
  Object.assign(customer, data);
  await customer.save();
  return customer;
}

export async function deleteCustomer(id) {
  const customer = await assertExists(Customer, id, "Customer not found");
  await customer.deleteOne();
  return { success: true };
}