import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./_navigation/admin-sidebar";

export default async function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex flex-col h-screen w-screen bg-muted">
        {children}
      </main>
    </SidebarProvider>
  );
}
