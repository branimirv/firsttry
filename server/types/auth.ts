import type mongoose from "mongoose";

/**
 * User data returned in responses (without sensitive data)
 */
export interface UserResponse {
  id: mongoose.Types.ObjectId;
  name: string;
  email: string;
}

/**
 * Tokens returned in auth responses
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Auth response with user data (for register/login)
 */
export interface AuthResponse extends TokenPair {
  user: UserResponse;
}

/**
 * Token refresh response (no user data)
 */
export interface RefreshResponse extends TokenPair {}
