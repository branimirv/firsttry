import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

const AuthBootstrap = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return null;
};

export default AuthBootstrap;
