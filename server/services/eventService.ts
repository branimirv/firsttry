import SportEvent, { type ISportEvent } from "../models/SportEvent.js";
import { AppError } from "../utils/error.js";

/**
 * Create a new sport event
 * @param name - The name of the event
 * @param sport - The type of sport
 * @param maxParticipants - Maximum number of participants
 * @param startTime - When the event starts
 * @param endTime - When the event ends
 * @param userId - ID of the user creating the event
 * @returns The created sport event
 */
export const createSportEvent = async (
  name: string,
  sport: string,
  maxParticipants: number,
  startTime: string,
  endTime: string,
  userId: string
): Promise<ISportEvent> => {
  // Create the event with the Model (not schema)
  const sportEvent = await SportEvent.create({
    name,
    sport,
    maxParticipants,
    startTime,
    endTime,
    createdBy: userId,
    participants: [], // Initialize empty participants array
  });

  return sportEvent;
};

/**
 * Get all sport events
 * Populates the createdBy field with user details
 */
export const getSportEvents = async (): Promise<ISportEvent[]> => {
  const sportEvents = await SportEvent.find()
    .populate("createdBy", "name email") // Get creator's name and email
    .sort({ createdAt: -1 }); // Newest first

  return sportEvents;
};

/**
 * Get a sport event by id
 */
export const getSportEventById = async (id: string): Promise<ISportEvent> => {
  const sportEvent = await SportEvent.findById(id)
    .populate("createdBy", "name email")
    .populate("participants", "name email");

  if (!sportEvent) {
    throw new AppError("Sport event not found", 404);
  }

  return sportEvent;
};

/**
 * Update a sport event by id
 * Only the creator can update
 */
export const updateSportEvent = async (
  id: string,
  userId: string,
  data: Partial<ISportEvent>
): Promise<ISportEvent> => {
  const sportEvent = await SportEvent.findById(id);

  if (!sportEvent) {
    throw new AppError("Sport event not found", 404);
  }

  // Check if user is the creator
  if (sportEvent.createdBy.toString() !== userId) {
    throw new AppError("You are not authorized to update this event", 403);
  }

  const updatedEvent = await SportEvent.findByIdAndUpdate(id, data, {
    new: true, // Return the updated document
    runValidators: true, // Run schema validators
  });

  return updatedEvent!;
};

/**
 * Delete a sport event by id
 * Only the creator can delete
 */
export const deleteSportEvent = async (
  id: string,
  userId: string
): Promise<void> => {
  const sportEvent = await SportEvent.findById(id);

  if (!sportEvent) {
    throw new AppError("Sport event not found", 404);
  }

  // Check if user is the creator
  if (sportEvent.createdBy.toString() !== userId) {
    throw new AppError("You are not authorized to delete this event", 403);
  }

  await SportEvent.findByIdAndDelete(id);
};
