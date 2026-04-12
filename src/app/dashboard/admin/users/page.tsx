import UserTable from "@/components/dashboard/admin/UserTable";
import PageHeader from "@/components/shared/PageHeader";
import { Users } from "lucide-react";

export const metadata = { title: "Manage Users" };

export default function AdminUsersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        icon={Users}
        title="Manage Users"
        description="View, activate, deactivate and manage user roles"
      />
      <UserTable />
    </div>
  );
}