import { body } from "express-validator";

export const registrationValidators = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginValidators = [
  body("email").isEmail().withMessage("please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const refreshValidators = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

export const logoutValidators = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),
];

export const forgotPasswordValidators = [
  body("email").isEmail().withMessage("Please provide a valid email"),
];

export const resetPasswordValidators = [
  body("token").notEmpty().withMessage("Reset token is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
