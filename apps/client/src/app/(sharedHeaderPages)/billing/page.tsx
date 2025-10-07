import Billing from "@/components/Billing/Billing";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

const BillingPage = () => {
  return (
    <ProtectedRoute>
      <Billing />
    </ProtectedRoute>
  );
};

export default BillingPage;
