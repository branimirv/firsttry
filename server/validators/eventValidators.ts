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

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Start time must be a valid date"),

  body("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .isISO8601()
    .withMessage("End time must be a valid date")
    .custom((endTime, { req }) => {
      // Custom validator to check if end time is after start time
      const start = new Date(req.body.startTime);
      const end = new Date(endTime);

      if (end <= start) {
        throw new Error("End time must be after start time");
      }

      return true;
    }),
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

  body("startTime")
    .optional()
    .isISO8601()
    .withMessage("Start time must be a valid date"),

  body("endTime")
    .optional()
    .isISO8601()
    .withMessage("End time must be a valid date")
    .custom((endTime, { req }) => {
      // Only validate if both times are provided
      if (endTime && req.body.startTime) {
        const start = new Date(req.body.startTime);
        const end = new Date(endTime);

        if (end <= start) {
          throw new Error("End time must be after start time");
        }
      }
      return true;
    }),
];

/**
 * Validators for event ID parameter
 */
export const eventIdValidator = [
  param("id").isMongoId().withMessage("Invalid event ID"),
];
