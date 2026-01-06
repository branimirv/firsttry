/**
 * Sport types available for events
 */
export const SPORT_TYPES = [
  "Soccer",
  "Basketball",
  "Tennis",
  "Baseball",
  "Volleyball",
] as const;

export type SportType = (typeof SPORT_TYPES)[number];

/**
 * User information
 */
export interface EventUser {
  _id: string;
  name: string;
  email: string;
}

/**
 * Sport Event from API
 */
export interface SportEvent {
  _id: string;
  name: string;
  sport: SportType;
  maxParticipans: number;
  createdBy: EventUser;
  participants: EventUser[];
  startTime: string;
  endTime: string;
  timestamps: boolean;
}

/**
 * Data for creating a new event
 */
export interface CreateEventData {
  name: string;
  sport: SportType;
  maxParticipants: number;
  startTime: string;
  endTime: string;
}
