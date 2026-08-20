import { catchAsync } from "../utils/catchAsync.js";
import * as userService from "../services/userService.js";

export const listUsers = catchAsync(async (req, res) => {
  const data = await userService.listUsers(req.query);
  res.status(200).json({ success: true, data });
});

export const getUser = catchAsync(async (req, res) => {
  const data = await userService.getUser(req.params.id);
  res.status(200).json({ success: true, data });
});

export const createUser = catchAsync(async (req, res) => {
  const data = await userService.createUser(req.body, req.user);
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data,
  });
});

export const updateUser = catchAsync(async (req, res) => {
  const data = await userService.updateUser(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data,
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  const data = await userService.deleteUser(req.params.id);
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data,
  });
});