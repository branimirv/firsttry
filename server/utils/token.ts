import crypto, { hash } from "crypto";
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
 * Create and store a refersh token for a user
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
): Promise<typeof RefreshToken | null> => {
  const hashedToken = hashRefreshToken(token);

  verifyRefreshToken(token);

  const storedToken = await RefreshToken.findOne({
    token: hashedToken,
    expiresAt: { $gt: new Date() },
  }).populate("userId");

  return storedToken;
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
