import type { Request, Response } from "express";
import * as sportEventService from "../services/sportEventService.js";
import { asyncHandler } from "../middleware/errorHandler.js";

/**
 * Create a new sport event
 */
export const createSportEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, sport, maxParticipants } = req.body;
    const result = await sportEventService.createSportEvent(
      name,
      sport,
      maxParticipants
    );
    res.status(201).json(result);
  }
);

/**
 * Get all sport events
 */
export const getSportEvents = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await sportEventService.getSportEvents();
    res.status(200).json(result);
  }
);

/**
 * Get a sport event by id
 */
export const getSportEventById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await sportEventService.getSportEventById(id);
    res.status(200).json(result);
  }
);

/**
 * Update a sport event
 */
export const updateSportEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await sportEventService.updateSportEvent(id, req.body);
    res.status(200).json(result);
  }
);

/**
 * Delete a sport event
 */
export const deleteSportEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await sportEventService.deleteSportEvent(id);
    res.status(204).send();
  }
);
