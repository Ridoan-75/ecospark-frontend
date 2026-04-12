import IdeaTable from "@/components/dashboard/admin/IdeaTable";
import PageHeader from "@/components/shared/PageHeader";
import { Lightbulb } from "lucide-react";

export const metadata = { title: "Manage Ideas" };

export default function AdminIdeasPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        icon={Lightbulb}
        title="Manage Ideas"
        description="Review, approve, reject and delete community ideas"
      />
      <IdeaTable />
    </div>
  );
}