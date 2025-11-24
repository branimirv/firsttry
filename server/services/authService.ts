import type mongoose from "mongoose";
import { generateAccessToken, type TokenPayload } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import {
  createPasswordResetToken,
  findPasswordResetToken,
  revokeAllUserResetTokens,
  revokePasswordResetToken,
} from "../utils/passwordReset.js";
import {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
} from "../utils/token.js";
import type { AuthResponse, RefreshResponse } from "../types/auth.js";
import * as userService from "./userService.js";
import {
  ConflictError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
} from "../utils/error.js";

/**
 * Register a new user
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  // Check if user already exists
  const existingUser = await userService.findUserByEmail(email);
  if (existingUser) {
    throw new ConflictError("User already exists");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await userService.createUser({
    name,
    email,
    password: hashedPassword,
  });

  // Generate tokens
  const tokenPayload: TokenPayload = {
    id: (user._id as mongoose.Types.ObjectId).toString(),
    email: user.email,
  };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = await createRefreshToken(
    user._id as mongoose.Types.ObjectId,
    tokenPayload
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id as mongoose.Types.ObjectId,
      name: user.name,
      email: user.email,
    },
  };
};

/**
 * Login a user
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  // Find user by email and include password
  const user = await userService.findUserByEmailWithPassword(email);
  if (!user) {
    throw new AuthenticationError("Invalid credentials");
  }

  // Compare password
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AuthenticationError("Invalid credentials");
  }

  // Generate tokens
  const tokenPayload: TokenPayload = {
    id: (user._id as mongoose.Types.ObjectId).toString(),
    email: user.email,
  };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = await createRefreshToken(
    user._id as mongoose.Types.ObjectId,
    tokenPayload
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id as mongoose.Types.ObjectId,
      name: user.name,
      email: user.email,
    },
  };
};

/**
 * Refresh access token
 */
export const refreshTokens = async (
  refreshToken: string
): Promise<RefreshResponse> => {
  const storedToken = await findRefreshToken(refreshToken);

  if (!storedToken) {
    throw new AuthenticationError("Invalid or expired refresh token");
  }

  const user = await userService.findUserById(storedToken.userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Revoke old refresh token
  await revokeRefreshToken(refreshToken);

  // Generate new tokens
  const tokenPayload: TokenPayload = {
    id: (user._id as mongoose.Types.ObjectId).toString(),
    email: user.email,
  };

  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = await createRefreshToken(
    user._id as mongoose.Types.ObjectId,
    tokenPayload
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * Logout a user
 */
export const logoutUser = async (refreshToken: string): Promise<void> => {
  await revokeRefreshToken(refreshToken);
};

/**
 * Initiate password reset process
 */
export const initiatePasswordReset = async (email: string): Promise<void> => {
  const user = await userService.findUserByEmail(email);

  // Always return success for security (don't reveal if email exists)
  if (user) {
    // Revoke all existing reset tokens
    await revokeAllUserResetTokens(user._id as mongoose.Types.ObjectId);

    // Generate new reset token
    const resetToken = await createPasswordResetToken(
      user._id as mongoose.Types.ObjectId
    );

    // TODO: Send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(
      `Reset URL: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    );
  }
};

/**
 * Reset user password with token
 */
export const resetUserPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  // Find and verify the reset token
  const resetToken = await findPasswordResetToken(token);

  if (!resetToken) {
    throw new Error("Invalid or expired reset token");
  }

  // Get the user
  const user = await userService.findUserById(resetToken.userId);
  if (!user) {
    throw new ValidationError("Invalid or expired reset token");
  }

  // Hash the new password
  const hashedPassword = await hashPassword(newPassword);

  // Update user password
  await userService.updateUserPassword(
    user._id as mongoose.Types.ObjectId,
    hashedPassword
  );

  // Revoke the reset token (one-time use)
  await revokePasswordResetToken(token);
};
