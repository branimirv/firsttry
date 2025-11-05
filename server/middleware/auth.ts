import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = { id: decoded.id, email: decoded.email, name: user.name };
    next(); // Call next to continue to the next middleware/route
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
