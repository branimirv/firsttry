import AuthGuard from "@/components/auth/AuthGuard";
import { useAuthStore } from "@/store/authStore";
import CreateEventDialog from "../events/CreateEventDialog";

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <AuthGuard>
      <div className="max-w-[1200px] w-full flex-1 mx-auto p-4 d-flex flex-col">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <CreateEventDialog />
      </div>
    </AuthGuard>
  );
};

export default Dashboard;
