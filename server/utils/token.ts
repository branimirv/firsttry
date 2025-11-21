import crypto from "crypto";
import RefreshToken from "../models/RefreshToken.js";
import type mongoose from "mongoose";
import {
  generateRefreshToken,
  verifyRefreshToken,
  type TokenPayload,
} from "./jwt.js";

/**
 * Hash a refresh token before storing in database
 */
export const hashRefreshToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Create and store a refresh token for a user
 */
export const createRefreshToken = async (
  userId: mongoose.Types.ObjectId,
  payload: TokenPayload
): Promise<string> => {
  // Generate refresh token
  const refreshToken = generateRefreshToken(payload);

  // Hash before storing
  const hashedToken = hashRefreshToken(refreshToken);

  // Calculate expiration date (30 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await RefreshToken.create({
    token: hashedToken,
    userId,
    expiresAt,
  });

  return refreshToken; // Return unhashed token to client
};

/**
 * Verify and find a refresh token in database
 */
export const findRefreshToken = async (
  token: string
): Promise<InstanceType<typeof RefreshToken> | null> => {
  try {
    // Verify token signature first (will throw AuthenticationError if invalid)
    verifyRefreshToken(token);

    const hashedToken = hashRefreshToken(token);

    const storedToken = await RefreshToken.findOne({
      token: hashedToken,
      expiresAt: { $gt: new Date() },
    }).populate("userId");

    return storedToken;
  } catch (error) {
    // Re-throw AuthenticationError from verifyRefreshToken
    // or handle other errors if needed
    throw error;
  }
};

/**
 * Revoke a refresh token (delete from database)
 */
export const revokeRefreshToken = async (token: string): Promise<void> => {
  const hashedToken = hashRefreshToken(token);
  await RefreshToken.deleteOne({ token: hashedToken });
};

/**
 * Revoke all refresh tokens for a user
 */
export const revokeAllUserTokens = async (
  userId: mongoose.Types.ObjectId
): Promise<void> => {
  await RefreshToken.deleteMany({ userId });
};
