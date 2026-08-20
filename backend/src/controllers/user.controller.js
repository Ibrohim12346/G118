import * as userService from "../services/user.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const list = asyncHandler(async (req, res) => {
  const data = await userService.listUsers(req.query);
  res.json({ success: true, data });
});

export const getOne = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.json({ success: true, data: user });
});

export const create = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({ success: true, data: user });
});

export const update = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.json({ success: true, data: user });
});

export const remove = asyncHandler(async (req, res) => {
  const user = await userService.deleteUser(req.params.id);
  res.json({ success: true, data: user });
});