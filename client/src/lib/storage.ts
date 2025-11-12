import { STORAGE_KEYS } from "./constants";

/**
 * Token storage abstraction
 * Provides type-safe localStorage operations for auth
 */

export const tokenStorage = {
  _getStorage: (usePersistent: boolean): Storage => {
    return usePersistent ? localStorage : sessionStorage;
  },
  // Access token
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;

    return (
      localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    );
  },
  setAccessToken: (token: string, usePersistent: boolean = true): void => {
    if (typeof window === "undefined") return;

    const storage = tokenStorage._getStorage(usePersistent);

    const otherStorage = usePersistent ? sessionStorage : localStorage;
    otherStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

    storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },
  // Refresh token
  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;

    return (
      localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    );
  },
  setRefreshToken: (token: string, usePersistent: boolean = true): void => {
    if (typeof window === "undefined") return;

    const storage = tokenStorage._getStorage(usePersistent);
    const otherStorage = usePersistent ? sessionStorage : localStorage;
    otherStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

    storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },
  /**
   * Combined operation to set both tokens
   *
   * @param accessToken - The access token JWT
   * @param refreshToken - The refresh token JWT
   * @param usePersistent - If true, use localStorage (remember me). If false, use sessionStorage (temporary)
   */
  setTokens: (
    accessToken: string,
    refreshToken: string,
    usePersistent: boolean = true
  ): void => {
    tokenStorage.setAccessToken(accessToken, usePersistent);
    tokenStorage.setRefreshToken(refreshToken, usePersistent);
  },
  removeTokens: (): void => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

    sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
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
