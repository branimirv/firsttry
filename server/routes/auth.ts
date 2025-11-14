import express, { Router, type Request, type Response } from "express";
import { body, validationResult } from "express-validator";
import type mongoose from "mongoose";
import User from "../models/User.js";
import { generateAccessToken } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import {
  createPasswordReseetToken,
  findPasswordResetToken,
  revokeAllUserResetTokens,
  revokePasswordResetToken,
} from "../utils/passwordReset.js";
import {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
} from "../utils/token.js";

const router: Router = express.Router();

// @route   POST /api/auth/registration
// @desc    Register a new user
// @access  Public
router.post(
  "/registration",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

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
  }
);

// @route POST /api/auth/login
// @desc Login a user
// @access Public
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

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
  }
);

// @route POST /api/auth/refresh
// @desc refresh token
// @access ??
router.post(
  "/refresh",
  [body("refreshToken").notEmpty().withMessage("Refresh token is required")],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

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
  }
);

// @route /api/auth/logout
router.post(
  "/logout",
  [body("refreshToken").notEmpty().withMessage("Refresh token is required")],
  async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      await revokeRefreshToken(refreshToken);
      res.json({ message: "logged out successfully" });
    } catch (error) {
      console.error("logout error:", error);
      res.status(500).json({ message: "server error" });
    }
  }
);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Please provide a valid email")],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

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
  }
);

// @route POST /api/auth/reset-password
// @desc Reset password with token
// @access Public
router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Reset token is required."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
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
  }
);

export default router;
