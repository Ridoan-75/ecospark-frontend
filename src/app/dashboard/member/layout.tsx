import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import MemberSidebar from "@/components/layout/MemberSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";

export default async function MemberLayout({
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
    <div className="min-h-screen flex bg-[#080b14]">
      <MemberSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}