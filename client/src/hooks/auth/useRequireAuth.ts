import { ROUTES } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { useAuthBootstrap } from "./useAuthBootstrap";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";

export type AuthStatus = "loading" | "unauthorized" | "authorized";

export interface UseRequireAuthOptions {
  redirectToLogin?: boolean;
  redirectRoute?: string;
}

export interface UseRequireAuthReturn {
  status: AuthStatus;
  isAuthenticated: boolean;
  user: ReturnType<typeof useAuthStore>["user"];
  isLoading: boolean;
}

export const useRequireAuth = (
  options: UseRequireAuthOptions = {}
): UseRequireAuthReturn => {
  const { redirectToLogin = true, redirectRoute = ROUTES.LOGIN } = options;
  const hasCheckedAuth = useAuthBootstrap();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const status = useMemo<AuthStatus>(() => {
    if (!hasCheckedAuth || isLoading) {
      return "loading";
    }
    if (!isAuthenticated) {
      return "unauthorized";
    }
    return "authorized";
  }, [hasCheckedAuth, isLoading, isAuthenticated]);

  useEffect(() => {
    if (
      redirectToLogin &&
      status === "unauthorized" &&
      hasCheckedAuth &&
      !isLoading
    ) {
      navigate({ to: redirectRoute, replace: true });
    }
  }, [
    status,
    hasCheckedAuth,
    isLoading,
    navigate,
    redirectToLogin,
    redirectRoute,
  ]);

  return {
    status,
    isAuthenticated,
    user,
    isLoading,
  };
};
