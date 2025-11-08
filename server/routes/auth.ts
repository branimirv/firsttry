import express, { Router, type Request, type Response } from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateAccessToken } from "../utils/jwt.js";
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
        id: user._id.toString(),
        email: user.email,
      };
      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = await createRefreshToken(user._id, tokenPayload);

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
        id: user._id.toString(),
        email: user.email,
      };
      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = await createRefreshToken(user._id, tokenPayload);

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
        id: user._id.toString(),
        email: user.email,
      };

      const newAccessToken = generateAccessToken(tokenPayload);
      const newRefreshToken = await createRefreshToken(user._id, tokenPayload);

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
  "/loguout",
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

export default router;
