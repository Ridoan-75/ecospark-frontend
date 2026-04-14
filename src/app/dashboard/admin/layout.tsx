import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminSidebar from "@/components/layout/AdminSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#080b14]">
      {/* Sidebar - hidden on mobile, visible on lg+ */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
          <div className="glass gradient-border rounded-2xl p-4 sm:p-6 md:p-8 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}