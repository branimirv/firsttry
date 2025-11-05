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
  token: string;
  user: User;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegistrationData {
  name: string;
  email: string;
  password: string;
}
