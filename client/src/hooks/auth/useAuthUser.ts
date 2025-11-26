import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "@/lib/constants";
import type { User } from "@/types/auth";

export interface UseAuthUserOptions {
  requireAuth?: boolean;
  redirectRoute?: string;
}

export const useAuthUser = (options: UseAuthUserOptions = {}): User | null => {
  const { requireAuth = false, redirectRoute = ROUTES.LOGIN } = options;

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  if (requireAuth && !isAuthenticated) {
    navigate({ to: redirectRoute, replace: true });
  }

  return user;
};
