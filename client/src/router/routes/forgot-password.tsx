import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../index";
import { ROUTES } from "@/lib/constants";
import ForgotPasswordForm from "@/components/auth/ForgotPassword";

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.FORGOT_PASSWORD,
  component: () => <ForgotPasswordForm />,
});

export default forgotPasswordRoute;
