import { authQueries } from "@/lib/queries/authQueries";
import { authQueryKeys } from "@/lib/queryKeys";
import { tokenStorage } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";

export const useCheckAuth = () => {
  const accessToken = tokenStorage.getAccessToken();

  return useQuery({
    queryKey: authQueryKeys.checkAuth(),
    queryFn: authQueries.checkAuth,
    enabled: !!accessToken,
    retry: false,
    staleTime: Infinity,
  });
};
