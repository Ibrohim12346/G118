import { User, Session, PasswordReset } from "../models/index.js";
import { ApiError } from "../utils/ApiError.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateRandomToken,
  refreshTokenExpiresAt,
} from "../utils/token.js";
import { ROLES } from "../constants/index.js";

function buildTokens(user) {
  const accessToken = signAccessToken({
    sub: user._id.toString(),
    role: user.role,
  });
  const refreshToken = signRefreshToken({
    sub: user._id.toString(),
  });
  return { accessToken, refreshToken };
}

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

export async function registerUser({ name, email, password, phone, role }) {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email already exists", { email: "Email already exists" });

  const user = await User.create({
    name,
    email,
    password,
    phone: phone || null,
    role: role || ROLES.SELLER,
  });

  const { accessToken, refreshToken } = buildTokens(user);
  await createSession(user._id, refreshToken, null, null);

  return { user: serializeUser(user), accessToken, refreshToken };
}

export async function loginUser({ email, password }, meta) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid email or password");
  if (!user.isActive) throw new ApiError(403, "Account is deactivated");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  user.lastLogin = new Date();
  await user.save();

  const { accessToken, refreshToken } = buildTokens(user);
  await createSession(user._id, refreshToken, meta.userAgent, meta.ipAddress);

  return { user: serializeUser(user), accessToken, refreshToken };
}

export async function createSession(userId, refreshToken, userAgent, ipAddress) {
  await Session.create({
    user: userId,
    refreshTokenHash: hashToken(refreshToken),
    userAgent: userAgent || null,
    ipAddress: ipAddress || null,
    expiresAt: refreshTokenExpiresAt(),
  });
}

export async function refreshAccessToken(refreshToken, meta) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const session = await Session.findOne({
    user: payload.sub,
    refreshTokenHash: hashToken(refreshToken),
  }).select("+refreshTokenHash");

  if (!session) throw new ApiError(401, "Invalid or expired refresh token");
  if (session.revokedAt) throw new ApiError(401, "Session has been revoked");
  if (session.expiresAt <= new Date()) {
    throw new ApiError(401, "Session has expired");
  }

  const user = await User.findById(payload.sub);
  if (!user) throw new ApiError(401, "User no longer exists");
  if (!user.isActive) throw new ApiError(403, "Account is deactivated");

  await session.deleteOne();

  const { accessToken, refreshToken: newRefreshToken } = buildTokens(user);
  await createSession(user._id, newRefreshToken, meta.userAgent, meta.ipAddress);

  return { user: serializeUser(user), accessToken, refreshToken: newRefreshToken };
}

export async function logoutUser(refreshToken) {
  if (!refreshToken) return;
  await Session.findOneAndUpdate(
    { refreshTokenHash: hashToken(refreshToken), revokedAt: null },
    { revokedAt: new Date() }
  );
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return serializeUser(user);
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(400, "Current password is incorrect");

  user.password = newPassword;
  await user.save();

  await Session.updateMany(
    { user: user._id, revokedAt: null },
    { revokedAt: new Date() }
  );

  return { success: true };
}

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email });
  if (!user) return { success: true };

  const token = generateRandomToken();
  await PasswordReset.create({
    user: user._id,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  return { success: true, token };
}

export async function resetPassword({ token, password }) {
  const reset = await PasswordReset.findOne({ tokenHash: hashToken(token) })
    .select("+tokenHash");

  if (!reset) throw new ApiError(400, "Invalid or expired reset token");
  if (reset.usedAt) throw new ApiError(400, "Reset token has already been used");
  if (reset.expiresAt <= new Date()) {
    throw new ApiError(400, "Reset token has expired");
  }

  const user = await User.findById(reset.user).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  user.password = password;
  await user.save();

  reset.usedAt = new Date();
  await reset.save();

  await Session.updateMany(
    { user: user._id, revokedAt: null },
    { revokedAt: new Date() }
  );

  return { success: true };
}