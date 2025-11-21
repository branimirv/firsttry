import type { Request, Response } from "express";
import * as authService from "../services/authService.js";
import { asyncHandler } from "../middleware/errorHandler.js";

/**
 * Register a new user
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const result = await authService.registerUser(name, email, password);
  res.status(201).json(result);
});

/**
 * Login a user
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.json(result);
});

/**
 * Refresh access token
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshTokens(refreshToken);
  res.json(result);
});

/**
 * Logout a user
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await authService.logoutUser(refreshToken);
  res.json({
    message: "Logged out successfully",
  });
});

/**
 * Send password reset email
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    await authService.initiatePasswordReset(email);
    res.json({
      message:
        "If an account exists with that email, a password reset link has been sent",
    });
  }
);

/**
 * Reset password with token
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body;
    await authService.resetUserPassword(token, password);
    res.json({
      message: "Password has been reset successfully",
    });
  }
);
