import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LoadingPage } from "../loaders/loading";
import { ROUTES } from "@/lib/constants";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, hasCheckedAuth, checkAuth } =
    useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasCheckedAuth) checkAuth();
  }, [checkAuth, hasCheckedAuth]);

  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated && !isLoading) {
      navigate({ to: ROUTES.LOGIN, replace: true });
    }
  }, [hasCheckedAuth, isAuthenticated, isLoading, navigate]);

  if (isLoading || !hasCheckedAuth) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) return null;

  return children;
};

export default AuthGuard;
