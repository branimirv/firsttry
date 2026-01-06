import type { Request, Response } from "express";
import * as eventService from "../services/eventService.js";
import { asyncHandler } from "../middleware/errorHandler.js";

/**
 * Create a new sport event
 */
export const createSportEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, sport, maxParticipants } = req.body;
    const userId = req.user!.id;

    const result = await eventService.createSportEvent(
      name,
      sport,
      maxParticipants,
      userId
    );
    res.status(201).json(result);
  }
);

/**
 * Get all sport events
 */
export const getSportEvents = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await eventService.getSportEvents();
    res.status(200).json(result);
  }
);

/**
 * Get a sport event by id
 */
export const getSportEventById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await eventService.getSportEventById(id);
    res.status(200).json(result);
  }
);

/**
 * Update a sport event
 */
export const updateSportEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await eventService.updateSportEvent(
      id,
      req.user!.id,
      req.body
    );
    res.status(200).json(result);
  }
);

/**
 * Delete a sport event
 */
export const deleteSportEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    await eventService.deleteSportEvent(id, userId);
    res.status(204).send();
  }
);
