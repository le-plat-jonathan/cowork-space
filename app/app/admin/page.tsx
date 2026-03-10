import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "./_components/admin-dashboard";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    redirect("/app");
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <AdminDashboard />
    </div>
  );
}
