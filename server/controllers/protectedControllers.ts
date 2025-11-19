import type { Request, Response } from "express";
/**
 * Get protected route
 */
export const getProtectedRoute = (req: Request, res: Response) => {
  res.json({
    message: "Protected route",
    user: req.user
      ? { id: req.user.id, email: req.user.email, name: req.user.name }
      : null,
  });
};
