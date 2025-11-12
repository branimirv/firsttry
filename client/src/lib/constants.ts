/**
 * Application constants
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTRATION: "/auth/registration",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },
  PROTECTED: "/protected",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTRATION: "/registration",
  DASHBOARD: "/dashboard",
  FORGOT_PASSWORD: "/forgot-password",
} as const;
