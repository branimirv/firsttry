import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../index";
import RegistrationForm from "@/components/auth/RegistrationForm";

const registrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/registration",
  component: () => <RegistrationForm />,
});

export default registrationRoute;
