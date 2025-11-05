import { createRoute } from "@tanstack/react-router";
import Dashboard from "../../components/pages/Dashboard";
import { rootRoute } from "../index";
import { ROUTES } from "@/lib/constants";

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: ROUTES.DASHBOARD,
  component: Dashboard,
});

export default dashboardRoute;
