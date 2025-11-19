import express, { Router, type Request, type Response } from "express";
import { authenticate } from "../middleware/auth.js";
import * as protectedController from "../controllers/protectedControllers.js";

const router: Router = express.Router();

router.get("/", authenticate, protectedController.getProtectedRoute);

export default router;
