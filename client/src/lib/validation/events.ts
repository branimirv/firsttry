import { SPORT_TYPES } from "@/types/event";
import { z } from "zod";

/**
 * Validation schema for creating a sport event
 */
export const createEventSchema = z
  .object({
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

    // Add these new fields - separate date and time inputs
    startDate: z.string().min(1, "Start date is required"),

    startTime: z.string().min(1, "Start time is required"),

    endDate: z.string().min(1, "End date is required"),

    endTime: z.string().min(1, "End time is required"),
  })
  .refine(
    (data) => {
      // Combine date and time to create full datetime for comparison
      const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
      const endDateTime = new Date(`${data.endDate}T${data.endTime}`);

      return endDateTime > startDateTime;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"], // This shows the error on the endTime field
    }
  );

export type CreateEventSchema = z.infer<typeof createEventSchema>;
