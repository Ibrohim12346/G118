import { catchAsync } from "../utils/catchAsync.js";
import * as orderService from "../services/orderService.js";

export const listOrders = catchAsync(async (req, res) => {
  const data = await orderService.listOrders(req.query);
  res.status(200).json({ success: true, data });
});

export const getOrder = catchAsync(async (req, res) => {
  const data = await orderService.getOrder(req.params.id);
  res.status(200).json({ success: true, data });
});

export const createOrder = catchAsync(async (req, res) => {
  const data = await orderService.createOrder(req.body, req.user);
  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data,
  });
});

export const updateOrder = catchAsync(async (req, res) => {
  const data = await orderService.updateOrder(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Order updated successfully",
    data,
  });
});

export const cancelOrder = catchAsync(async (req, res) => {
  const data = await orderService.cancelOrder(req.params.id);
  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data,
  });
});

export const deleteOrder = catchAsync(async (req, res) => {
  const data = await orderService.deleteOrder(req.params.id);
  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
    data,
  });
});