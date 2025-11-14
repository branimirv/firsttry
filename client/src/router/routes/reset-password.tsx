import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { ROUTES } from "@/lib/constants";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "..";

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.RESET_PASSWORD,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || undefined,
    };
  },
  component: () => <ResetPasswordForm />,
});

export default resetPasswordRoute;
