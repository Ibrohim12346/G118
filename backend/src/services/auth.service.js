import User from "../models/User.js";
import Session from "../models/Session.js";
import PasswordReset from "../models/PasswordReset.js";
import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";
import {
  signAccessToken,
  generateRefreshToken,
  generatePasswordResetToken,
  hashValue,
} from "../utils/token.js";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

const getSessionExpiry = () => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.refreshTokenTtlDays);
  return expiresAt;
};

const issueTokens = async (user, meta = {}) => {
  const accessToken = signAccessToken(user);
  const { token: refreshToken, hash } = generateRefreshToken();
  await Session.create({
    user: user._id,
    refreshTokenHash: hash,
    userAgent: meta.userAgent || null,
    ipAddress: meta.ipAddress || null,
    expiresAt: getSessionExpiry(),
  });
  return { accessToken, refreshToken };
};

const revokeAllSessions = async (userId) => {
  await Session.updateMany(
    { user: userId, revokedAt: null },
    { revokedAt: new Date(), expiresAt: new Date() }
  );
};

export const register = async (data, meta = {}) => {
  const email = data.email.toLowerCase().trim();
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "Email already registered", {
      email: "Email already registered",
    });
  }

  const user = await User.create({ ...data, email, role: "seller" });
  const tokens = await issueTokens(user, meta);
  return { user: user.toJSON(), ...tokens };
};

export const login = async ({ email, password }, meta = {}) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    "+password"
  );
  if (!user) throw new ApiError(401, "Invalid email or password");

  const valid = await user.comparePassword(password);
  if (!valid) throw new ApiError(401, "Invalid email or password");
  if (!user.isActive) throw new ApiError(403, "Account is deactivated");

  user.lastLogin = new Date();
  await user.save();

  const tokens = await issueTokens(user, meta);
  return { user: user.toJSON(), ...tokens };
};

export const refresh = async ({ refreshToken }, meta = {}) => {
  const session = await Session.findOne({
    refreshTokenHash: hashValue(refreshToken),
  }).select("+refreshTokenHash");
  if (!session) throw new ApiError(401, "Invalid refresh token");
  if (session.revokedAt) throw new ApiError(401, "Session has been revoked");
  if (session.expiresAt < new Date()) throw new ApiError(401, "Refresh token expired");

  const user = await User.findById(session.user);
  if (!user) throw new ApiError(401, "User no longer exists");
  if (!user.isActive) throw new ApiError(403, "Account is deactivated");

  session.revokedAt = new Date();
  session.expiresAt = new Date();
  await session.save();

  const tokens = await issueTokens(user, meta);
  return { user: user.toJSON(), ...tokens };
};

export const logout = async ({ refreshToken }) => {
  await Session.findOneAndUpdate(
    { refreshTokenHash: hashValue(refreshToken) },
    { revokedAt: new Date(), expiresAt: new Date() }
  );
  return true;
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  const valid = await user.comparePassword(currentPassword);
  if (!valid) throw new ApiError(400, "Current password is incorrect");

  user.password = newPassword;
  await user.save();
  await revokeAllSessions(userId);
  return true;
};

export const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return { resetToken: null };

  const token = generatePasswordResetToken();
  await PasswordReset.create({
    user: user._id,
    tokenHash: hashValue(token),
    expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
  });

  return { resetToken: token };
};

export const resetPassword = async ({ token, newPassword }) => {
  const record = await PasswordReset.findOne({
    tokenHash: hashValue(token),
  }).select("+tokenHash");
  if (!record) throw new ApiError(400, "Invalid or expired reset token");
  if (record.usedAt) throw new ApiError(400, "Reset token already used");
  if (record.expiresAt < new Date()) throw new ApiError(400, "Reset token expired");

  const user = await User.findById(record.user).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  user.password = newPassword;
  await user.save();

  record.usedAt = new Date();
  record.expiresAt = new Date();
  await record.save();

  await revokeAllSessions(user._id);
  return true;
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};