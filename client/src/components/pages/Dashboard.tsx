import AuthGuard from "@/components/auth/AuthGuard";
import { useAuthStore } from "@/store/authStore";

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <AuthGuard>
      <div className="max-w-[1200px] mx-auto p-8 d-flex flex-col">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome, {user?.name}</p>
          <p>This is protected route.</p>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Dashboard;
