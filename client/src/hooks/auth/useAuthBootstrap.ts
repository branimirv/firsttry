import { useAuthStore } from "@/store/authStore";
import { useEffect, useRef } from "react";

export const useAuthBootstrap = (): boolean => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const hasCheckedAuth = useAuthStore((state) => state.hasCheckedAuth);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!hasRunRef.current && !hasCheckedAuth) {
      hasRunRef.current = true;
      checkAuth().catch((error) => {
        console.error("Auth bootstrap error", error);
      });
    }
  }, [checkAuth, hasCheckedAuth]);

  return hasCheckedAuth;
};
