import { create } from "zustand";
import api from "@/lib/api";
import type {
  AuthResponse,
  LoginCredentials,
  RegistrationData,
} from "@/types/auth";
import { API_ENDPOINTS } from "@/lib/constants";
import { tokenStorage } from "@/lib/storage";
import { extractErrorMessage } from "@/lib/errors";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  hasCheckedAuth: boolean;
}

const initialState: AuthStore = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  hasCheckedAuth: false,
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
  register: async () => {},
  resetPassword: async () => {},
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    try {
      const response = await api.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials as LoginCredentials
      );

      tokenStorage.setTokens(
        response.data.accessToken,
        response.data.refreshToken
      );

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(
        error,
        "Login failed. Please check your credentials"
      );
      throw new Error(errorMessage);
    }
  },
  logout: async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        try {
          await api.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
        } catch (error) {
          console.error("logout endpoint error:", error);
        }
      }
    } catch (error) {
      console.log("error:", error);
    } finally {
      tokenStorage.removeTokens();
      set({
        user: null,
        isAuthenticated: false,
        hasCheckedAuth: true,
      });
    }
  },
  checkAuth: async () => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      set({ user: null, isAuthenticated: false, hasCheckedAuth: true });
      return;
    }

    set({ isLoading: true });

    try {
      const response = await api.get(API_ENDPOINTS.PROTECTED);
      set({
        isAuthenticated: true,
        user: response.data.user,
        isLoading: false,
        hasCheckedAuth: true,
      });
    } catch (error) {
      tokenStorage.removeTokens();
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        hasCheckedAuth: true,
      });
      throw error;
    }
  },
  register: async (data: RegistrationData) => {
    set({ isLoading: true });
    try {
      const response = await api.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTRATION,
        data
      );

      tokenStorage.setTokens(
        response.data.accessToken,
        response.data.refreshToken
      );

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(
        error,
        "Registration failed. Please try again"
      );
      throw new Error(errorMessage);
    }
  },
}));
