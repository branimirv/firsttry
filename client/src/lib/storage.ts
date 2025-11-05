import { STORAGE_KEYS } from "./constants";

/**
 * Token storage abstraction
 * Provides type-safe localStorage operations for auth
 */

export const tokenStorage = {
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
