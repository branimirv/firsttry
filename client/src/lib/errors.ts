import { AxiosError } from "axios";

/**
 * Extracts error message from API error response
 * Handles different error response formats
 */
export const extractErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (error instanceof AxiosError) {
    const errors = error.response?.data?.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      return errors[0].msg || errors[0]?.message || fallback;
    }

    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    return error.response?.statusText || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

/**
 * Type guard to check if error is an AxiosError
 */
export const isAxiosError = (error: unknown): error is AxiosError => {
  return error instanceof AxiosError;
};
