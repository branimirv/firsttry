import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../index";

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <div>Hello World</div>,
});

export default indexRoute;
