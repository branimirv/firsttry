import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../index";
import LoginForm from "@/components/auth/LoginForm";

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <LoginForm />,
});

export default loginRoute;
