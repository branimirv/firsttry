import logo from "@/assets/images/logo.svg";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { Link, useNavigate } from "@tanstack/react-router";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate({ to: ROUTES.HOME });
  };

  return (
    <header className="max-w-[1200px] mx-auto p-4 flex items-center justify-between">
      <Link to={ROUTES.HOME}>
        <img src={logo} alt="Logo" className="h-8" />
      </Link>
      <div>
        {isAuthenticated ? (
          <>
            <span>Hello, {user?.name}</span>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="cursor-pointer"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to={ROUTES.LOGIN}>
              <Button variant="outline" className="cursor-pointer">
                Login
              </Button>
            </Link>
            <Link to={ROUTES.REGISTRATION}>
              <Button className="cursor-pointer">Register</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
export default Header;
