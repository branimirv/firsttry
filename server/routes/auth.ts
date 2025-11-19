import express, { Router } from "express";
import { body } from "express-validator";
import * as authController from "../controllers/authControllers.js";
import { validate } from "../middleware/validation.js";

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
  validate,
  authController.register
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
  validate,
  authController.login
);

// @route POST /api/auth/refresh
// @desc refresh token
// @access ??
router.post(
  "/refresh",
  [body("refreshToken").notEmpty().withMessage("Refresh token is required")],
  validate,
  authController.refresh
);

// @route /api/auth/logout
// @desc Logout a user
// @access Public
router.post(
  "/logout",
  [body("refreshToken").notEmpty().withMessage("Refresh token is required")],
  validate,
  authController.logout
);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Please provide a valid email")],
  validate,
  authController.forgotPassword
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
  validate,
  authController.resetPassword
);

export default router;
