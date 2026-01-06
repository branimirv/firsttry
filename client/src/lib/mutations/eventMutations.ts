import type { CreateEventData, SportEvent } from "@/types/event";
import api from "../api";
import { API_ENDPOINTS } from "../constants";

/**
 * API call to create a new sport event
 */
export const createEvent = async (
  data: CreateEventData
): Promise<SportEvent> => {
  const response = await api.post<SportEvent>(
    API_ENDPOINTS.EVENTS.CREATE,
    data
  );
  return response.data;
};

/**
 * API call to get all events
 */
export const getEvents = async (): Promise<SportEvent[]> => {
  const response = await api.get<SportEvent[]>(API_ENDPOINTS.EVENTS.LIST);

  return response.data;
};

export const eventMutations = {
  createEvent,
  getEvents,
};
