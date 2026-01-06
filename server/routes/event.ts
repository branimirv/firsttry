import express, { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  createEventValidators,
  eventIdValidator,
  updateEventValidators,
} from "../validators/eventValidators.js";
import { validate } from "../middleware/validation.js";
import * as eventController from "../controllers/eventController.js";

const router: Router = express.Router();

// @route   POST /api/events
// @desc    Create a new sport event
// @access  Private
router.post(
  "/",
  authenticate,
  createEventValidators,
  validate,
  eventController.createSportEvent
);

// @route   GET /api/events
// @desc    Get all sport events
// @access  Private
router.get("/", eventController.getSportEvents);

// @route   GET /api/events/:id
// @desc    Get a sport event by id
// @access  Private
router.get(
  ":id",
  eventIdValidator,
  validate,
  eventController.getSportEventById
);

// @route   PUT /api/events/:id
// @desc    Update a sport event
// @access  Private
router.put(
  "/:id",
  authenticate,
  updateEventValidators,
  validate,
  eventController.updateSportEvent
);

// @route   DELETE /api/events/:id
// @desc    Delete a sport event
// @access  Private
router.delete(
  "/:id",
  authenticate,
  eventIdValidator,
  validate,
  eventController.deleteSportEvent
);

export default router;
