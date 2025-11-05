import express, { Router, type Request, type Response } from "express";
import { authenticate } from "../middleware/auth.js";

const router: Router = express.Router();

router.get("/", authenticate, (req: Request, res: Response) => {
  res.json({
    message: "Protected route",
    user: req.user
      ? { id: req.user.id, email: req.user.email, name: req.user.name }
      : null,
  });
});

export default router;
