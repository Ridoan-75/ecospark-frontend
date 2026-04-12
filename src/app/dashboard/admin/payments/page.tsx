import PaymentTable from "@/components/dashboard/admin/PaymentTable";
import PageHeader from "@/components/shared/PageHeader";
import { CreditCard } from "lucide-react";

export const metadata = { title: "Manage Payments" };

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        icon={CreditCard}
        title="Payment Overview"
        description="Track all transactions and revenue across the platform"
      />
      <PaymentTable />
    </div>
  );
}