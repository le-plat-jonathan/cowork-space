import { getRequiredAdmin } from "@/lib/auth/auth-user";
import { AdminDashboard } from "./_components/admin-dashboard";

export default async function AdminPage() {
  await getRequiredAdmin();

  return (
    <div className="flex-1 overflow-auto p-6">
      <AdminDashboard />
    </div>
  );
}
