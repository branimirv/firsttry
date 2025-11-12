/**
 * User type definition
 */
export interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * Auth response from API
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/**
 * Refresh token response from API
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Registration data
 */
export interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

/**
 * Forgot password data
 */
export interface ForgotPasswordData {
  email: string;
}
