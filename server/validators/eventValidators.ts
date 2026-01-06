import { body, param } from "express-validator";
import { SPORT_TYPES } from "../models/SportEvent.js";

/**
 * Validators for creating sport event
 */
export const createEventValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Event name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Event name must be between 3 and 100 charachters"),

  body("sport")
    .trim()
    .notEmpty()
    .withMessage("Sport type is required")
    .isIn(SPORT_TYPES)
    .withMessage(`Sport must be one of: ${SPORT_TYPES.join(", ")}`),

  body("maxParticipants")
    .notEmpty()
    .withMessage("Maximum participants is required")
    .isInt({ min: 2, max: 100 })
    .withMessage("Maximum participants must be between 2 and 100"),
];

/**
 * Validators for updating a sport event
 */
export const updateEventValidators = [
  param("id").isMongoId().withMessage("Invalid event ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Event name must be between 3 and 100 characters"),

  body("sport")
    .optional()
    .trim()
    .isIn(SPORT_TYPES)
    .withMessage(`Sport must be one of: ${SPORT_TYPES.join(", ")}`),

  body("maxParticipants")
    .optional()
    .isInt({ min: 2, max: 100 })
    .withMessage("Maximum participants must be between 2 and 100"),
];

/**
 * Validators for event ID parameter
 */
export const eventIdValidator = [
  param("id").isMongoId().withMessage("Invalid event ID"),
];
