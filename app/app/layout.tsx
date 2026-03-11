import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./_navigation/dashboard-sidebar";

export default async function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex flex-col h-screen w-screen bg-muted">
        {children}
      </main>
    </SidebarProvider>
  );
}
