import logo from "@/assets/images/logo.svg";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate({ to: ROUTES.HOME });
    toast("You signed out!", { duration: 1000, position: "top-center" });
  };

  return (
    <header className="max-w-[1200px] mx-auto p-4 flex items-center justify-between">
      <Link to={ROUTES.HOME}>
        <img src={logo} alt="Logo" className="h-8" />
      </Link>
      <div>
        {isAuthenticated ? (
          <>
            <span className="mr-2">Hello, {user?.name}</span>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="cursor-pointer"
            >
              Logout
            </Button>
          </>
        ) : (
          <div className="space-x-2">
            <Link to={ROUTES.LOGIN}>
              <Button variant="outline" className="cursor-pointer">
                Login
              </Button>
            </Link>
            <Link to={ROUTES.REGISTRATION}>
              <Button className="cursor-pointer">Register</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
