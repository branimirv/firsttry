import crypto from "crypto";
import type mongoose from "mongoose";
import PasswordResetToken from "../models/PasswordResetToken.js";

/**
 * Hash a password reset token before storing in database
 */
export const hashPasswordResetToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Generate a random password reset token
 */
export const generatePasswordResetToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Create and store a password reset token for a user
 */
export const createPasswordReseetToken = async (
  userId: mongoose.Types.ObjectId
): Promise<string> => {
  // Generate random token
  const resetToken = generatePasswordResetToken();

  // hash before storing
  const hashedToken = hashPasswordResetToken(resetToken);

  // Calculate expirateon date (1 hour from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  // delete any existing reset token for this user
  await PasswordResetToken.deleteMany({ userId });

  // create new reset token
  await PasswordResetToken.create({
    token: hashedToken,
    userId,
    expiresAt,
  });

  return resetToken;
};

/**
 * Find and verify a password reset token
 */
export const findPasswordResetToken = async (
  token: string
): Promise<InstanceType<typeof PasswordResetToken> | null> => {
  const hashedToken = hashPasswordResetToken(token);

  const storedToken = await PasswordResetToken.findOne({
    token: hashedToken,
    expiresAt: { $gt: new Date() },
  }).populate("userId");

  return storedToken;
};

/**
 * Revoke a password reset token (delete from database)
 */
export const revokePasswordResetToken = async (
  token: string
): Promise<void> => {
  const hashedToken = hashPasswordResetToken(token);
  await PasswordResetToken.deleteOne({ token: hashedToken });
};

/**
 * Revoke all password reset tokens for a user
 */
export const revokeAllUserResetTokens = async (
  userId: mongoose.Types.ObjectId
): Promise<void> => {
  await PasswordResetToken.deleteMany({ userId });
};
