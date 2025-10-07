import Dashboard from "@/components/Dashboard/Dashboard";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
};

export default DashboardPage;
