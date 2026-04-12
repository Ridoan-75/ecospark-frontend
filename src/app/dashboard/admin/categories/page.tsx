import CategoryTable from "@/components/dashboard/admin/CategoryTable";
import PageHeader from "@/components/shared/PageHeader";
import { Tag } from "lucide-react";

export const metadata = { title: "Manage Categories" };

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        icon={Tag}
        title="Manage Categories"
        description="Create, edit and delete idea categories"
      />
      <CategoryTable />
    </div>
  );
}