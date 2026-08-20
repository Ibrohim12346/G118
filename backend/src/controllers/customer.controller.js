import * as customerService from "../services/customer.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const list = asyncHandler(async (req, res) => {
  const data = await customerService.listCustomers(req.query);
  res.json({ success: true, data });
});

export const getOne = asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.id);
  res.json({ success: true, data: customer });
});

export const create = asyncHandler(async (req, res) => {
  const customer = await customerService.createCustomer(req.body);
  res.status(201).json({ success: true, data: customer });
});

export const update = asyncHandler(async (req, res) => {
  const customer = await customerService.updateCustomer(req.params.id, req.body);
  res.json({ success: true, data: customer });
});

export const remove = asyncHandler(async (req, res) => {
  const customer = await customerService.deleteCustomer(req.params.id);
  res.json({ success: true, data: customer });
});