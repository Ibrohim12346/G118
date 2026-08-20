import { catchAsync } from "../utils/catchAsync.js";
import * as customerService from "../services/customerService.js";

export const listCustomers = catchAsync(async (req, res) => {
  const data = await customerService.listCustomers(req.query);
  res.status(200).json({ success: true, data });
});

export const getCustomer = catchAsync(async (req, res) => {
  const data = await customerService.getCustomer(req.params.id);
  res.status(200).json({ success: true, data });
});

export const createCustomer = catchAsync(async (req, res) => {
  const data = await customerService.createCustomer(req.body);
  res.status(201).json({
    success: true,
    message: "Customer created successfully",
    data,
  });
});

export const updateCustomer = catchAsync(async (req, res) => {
  const data = await customerService.updateCustomer(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Customer updated successfully",
    data,
  });
});

export const deleteCustomer = catchAsync(async (req, res) => {
  const data = await customerService.deleteCustomer(req.params.id);
  res.status(200).json({
    success: true,
    message: "Customer deleted successfully",
    data,
  });
});