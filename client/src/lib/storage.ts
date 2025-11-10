import { STORAGE_KEYS } from "./constants";

/**
 * Token storage abstraction
 * Provides type-safe localStorage operations for auth
 */

export const tokenStorage = {
  // Access token
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },
  setAccessToken: (token: string): void => {
    if (typeof window === "undefined") return;
    return localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },
  // Refresh token
  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
  setRefreshToken: (token: string): void => {
    if (typeof window === "undefined") return;
    return localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },
  // combined operations
  setTokens: (accessToken: string, refreshToken: string): void => {
    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);
  },
  removeTokens: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  set: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  remove: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  exists: (): boolean => {
    return tokenStorage.get() !== null;
  },
};
