import logo from "@/assets/images/logo.svg";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate({ to: ROUTES.HOME });
    toast("You signed out!", { duration: 1000, position: "top-center" });
  };

  return (
    <header className="w-full max-w-[1200px] mx-auto p-4 flex items-center justify-between">
      <Link to={ROUTES.HOME}>
        <img src={logo} alt="Logo" className="h-8" />
      </Link>
      <div>
        {isAuthenticated ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <div className="flex gap-2 items-center">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>{user?.name}</div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
