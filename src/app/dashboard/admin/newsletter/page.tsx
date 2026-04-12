import NewsletterTable from "@/components/dashboard/admin/NewsletterTable";
import PageHeader from "@/components/shared/PageHeader";
import { Mail } from "lucide-react";

export const metadata = { title: "Newsletter Subscribers" };

export default function AdminNewsletterPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        icon={Mail}
        title="Newsletter Subscribers"
        description="View and manage email subscribers"
      />
      <NewsletterTable />
    </div>
  );
}