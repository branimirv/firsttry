export const authQueryKeys = {
  all: ["auth"] as const,
  user: () => [...authQueryKeys.all, "user"] as const,
  checkAuth: () => [...authQueryKeys.all, "check"] as const,
} as const;
