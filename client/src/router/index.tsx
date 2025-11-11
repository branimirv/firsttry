import AuthBootstrap from "@/components/auth/AuthBootstrap";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { createRootRoute, createRouter, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import dashboardRoute from "./routes/dashboard";
import indexRoute from "./routes/index";
import loginRoute from "./routes/login";
import registrationRoute from "./routes/registration";
import { Toaster } from "@/components/ui/sonner";

// create a root route
export const rootRoute = createRootRoute({
  component: () => (
    <>
      <div>
        <Header />
        <AuthBootstrap />
        <Outlet />
        <Footer />
        <Toaster />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
});

//create the router
export const router = createRouter({
  routeTree: rootRoute.addChildren([
    indexRoute,
    loginRoute,
    dashboardRoute,
    registrationRoute,
  ]),
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
