import type { Request, Response } from "express";
import * as authService from "../services/authService.js";

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const result = await authService.registerUser(name, email, password);

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "User already exists") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Login a user
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    res.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "Invalid credentials") {
      return res.status(401).json({ message: error.message });
    }
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Refresh access token
 */
export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshTokens(refreshToken);

    res.json(result);
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(401).json({
      message:
        error instanceof Error
          ? error.message
          : "Invalid or expired refresh token",
    });
  }
};

/**
 * Logout a user
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    await authService.logoutUser(refreshToken);
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Send password reset email
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    await authService.initiatePasswordReset(email);

    res.json({
      message:
        "If an account exists with that email, a password reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    await authService.resetUserPassword(token, password);

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Invalid or expired reset token" ||
        error.message === "User not found")
    ) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
