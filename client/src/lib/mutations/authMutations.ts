import type {
  AuthResponse,
  LoginCredentials,
  RegistrationData,
  ResetPasswordData,
} from "@/types/auth";
import api from "../api";
import { API_ENDPOINTS } from "../constants";
import { tokenStorage } from "../storage";

export const authMutations = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { rememberMe, ...credentialsForApi } = credentials;
    const response = await api.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentialsForApi
    );

    tokenStorage.setTokens(
      response.data.accessToken,
      response.data.refreshToken,
      rememberMe ?? false
    );

    return response.data;
  },
  register: async (data: RegistrationData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTRATION,
      data
    );

    tokenStorage.setTokens(
      response.data.accessToken,
      response.data.refreshToken
    );

    return response.data;
  },
  logout: async (): Promise<void> => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      try {
        await api.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
      } catch (error) {
        console.error("logout endpoint error:", error);
      }
    }
    tokenStorage.removeTokens();
  },
  resetPassword: async (email: string): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },
  resetPasswordWithToken: async (data: ResetPasswordData): Promise<void> => {
    await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },
};
