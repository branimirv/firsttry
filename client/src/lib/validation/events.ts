import { SPORT_TYPES } from "@/types/event";
import { z } from "zod";

/**
 * Validation schema for creating a sport event
 */
export const createEventSchema = z.object({
  name: z
    .string()
    .min(3, "Event must be at least 3 charachters")
    .max(100, "Event must not exceed 100 characters")
    .trim(),
  sport: z.enum(SPORT_TYPES, {
    errorMap: () => ({ message: "Please select a valid sport" }),
  }),
  maxParticipants: z
    .number({
      required_error: "Maximum participants is required",
      invalid_type_error: "Maximum participants must be a number",
    })
    .int("Must be a whole number")
    .min(2, "Minimum 2 participants required")
    .max(100, "Maximum 100 participants allowed"),
});

export type createEventSchema = z.infer<typeof createEventSchema>;
