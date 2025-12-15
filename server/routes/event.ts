import express, { Router } from "express";
import { authenticate } from "../middleware/auth.js";

const router: Router = express.Router();

// @route   POST /api/events
// @desc    Create a new sport event
// @access  Private
router.post("/api/events", authenticate, createSportEvent);

// @route   GET /api/events
// @desc    Get all sport events
// @access  Private
router.get("/api/events", authenticate, getSportEvents);

// @route   GET /api/events/:id
// @desc    Get a sport event by id
// @access  Private
router.get("/api/events/:id", authenticate, getSportEventById);

// @route   PUT /api/events/:id
// @desc    Update a sport event
// @access  Private
router.put("/api/events/:id", authenticate, updateSportEvent);

// @route   DELETE /api/events/:id
// @desc    Delete a sport event
// @access  Private
router.delete("/api/events/:id", authenticate, deleteSportEvent);

export default router;
