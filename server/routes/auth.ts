import express, { Router } from "express";
import * as authController from "../controllers/authControllers.js";
import { validate } from "../middleware/validation.js";
import {
  forgotPasswordValidators,
  loginValidators,
  logoutValidators,
  refreshValidators,
  registrationValidators,
  resetPasswordValidators,
} from "../validators/authValidators.js";

const router: Router = express.Router();

// @route   POST /api/auth/registration
// @desc    Register a new user
// @access  Public
router.post(
  "/registration",
  registrationValidators,
  validate,
  authController.register
);

// @route POST /api/auth/login
// @desc Login a user
// @access Public
router.post("/login", loginValidators, validate, authController.login);

// @route POST /api/auth/refresh
// @desc refresh token
// @access ??
router.post("/refresh", refreshValidators, validate, authController.refresh);

// @route /api/auth/logout
// @desc Logout a user
// @access Public
router.post("/logout", logoutValidators, validate, authController.logout);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post(
  "/forgot-password",
  forgotPasswordValidators,
  validate,
  authController.forgotPassword
);

// @route POST /api/auth/reset-password
// @desc Reset password with token
// @access Public
router.post(
  "/reset-password",
  resetPasswordValidators,
  validate,
  authController.resetPassword
);

export default router;
