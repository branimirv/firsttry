import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.js";

/**
 * Standard error response format
 */
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    stack?: string; // Optional stack trace
  };
}

/**
 * Centralized error handling middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle known operational errors
  if (err instanceof AppError && err.isOperational) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: err.message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
      },
    };

    return res.status(err.statusCode).json(response);
  }

  // Handle unknown/unexpected errors
  const response: ErrorResponse = {
    success: false,
    error: {
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  };

  res.status(500).json(response);
};

/**
 * Handle async route errors
 * Wraps async route handlers to catch errors and pass to errorHandler
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
