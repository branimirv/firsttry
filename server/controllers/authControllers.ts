import type { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import { generateAccessToken } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import {
  findPasswordResetToken,
  revokeAllUserResetTokens,
  revokePasswordResetToken,
  createPasswordReseetToken,
} from "../utils/passwordReset.js";
import {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
} from "../utils/token.js";

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User alreeday exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate tokens
    const tokenPayload = {
      id: (user._id as mongoose.Types.ObjectId).toString(),
      email: user.email,
    };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = await createRefreshToken(
      user._id as mongoose.Types.ObjectId,
      tokenPayload
    );

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("reigster error:", error);
    res.status(500).json({ message: "server error" });
  }
};

/**
 * Login a user
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email and include password (select: false in model)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const tokenPayload = {
      id: (user._id as mongoose.Types.ObjectId).toString(),
      email: user.email,
    };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = await createRefreshToken(
      user._id as mongoose.Types.ObjectId,
      tokenPayload
    );

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("login error", error);
    res.status(500).json({ message: "server error" });
  }
};

/**
 * Refresh acces token
 */
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const storedToken = await findRefreshToken(refreshToken);

    if (!storedToken) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(storedToken.userId);
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    await revokeRefreshToken(refreshToken);

    const tokenPayload = {
      id: (user._id as mongoose.Types.ObjectId).toString(),
      email: user.email,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = await createRefreshToken(
      user._id as mongoose.Types.ObjectId,
      tokenPayload
    );

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("refresh error:", error);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

/**
 * Logout a user
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    await revokeRefreshToken(refreshToken);
    res.json({ message: "logged out successfully" });
  } catch (error) {
    console.error("logout error:", error);
    res.status(500).json({ message: "server error" });
  }
};

/**
 * Send password reset email
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always return success for security (don't reveal if email exists)
    // In production, you would:
    // 1. Generate a reset token
    // 2. Store it in DB with expiration
    // 3. Send email with reset link

    if (user) {
      // TODO: Generate reset token and send email
      await revokeAllUserResetTokens(user._id as mongoose.Types.ObjectId);

      // generate new token
      const resetToken = await createPasswordReseetToken(
        user._id as mongoose.Types.ObjectId
      );

      console.log(`Password reset token for ${email}: $ ${resetToken}`);
      console.log(
        `Reset URL: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
      );
    }

    res.json({
      message:
        "If an account exist with that email, a password reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "server error" });
  }
};

/**
 * Reset oassword with token
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    // find and verify the reset token
    const resetToken = await findPasswordResetToken(token);

    if (!resetToken) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Get the user
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // hash the new password
    const hashedPassword = await hashPassword(password);

    // update user password
    user.password = hashedPassword;
    await user.save();

    // revoke the reset token (one-time use)
    await revokePasswordResetToken(token);

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
