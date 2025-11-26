import { LoadingPage } from "../loaders/loading";
import { useRequireAuth } from "@/hooks/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectRoute?: string;
}

const AuthGuard = ({ children, redirectRoute }: AuthGuardProps) => {
  const { status } = useRequireAuth({
    redirectToLogin: true,
    redirectRoute,
  });

  if (status === "loading") {
    return <LoadingPage />;
  }

  if (status === "unauthorized") {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
