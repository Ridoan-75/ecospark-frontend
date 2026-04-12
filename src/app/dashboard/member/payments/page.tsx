"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard, ExternalLink } from "lucide-react";
import Link from "next/link";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { paymentService } from "@/services/payment.service";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";

const statusConfig: Record<string, { label: string; className: string }> = {
  SUCCESS: { label: "Success", className: "badge-green" },
  PENDING: { label: "Pending", className: "badge-amber" },
  FAILED: { label: "Failed", className: "badge-red" },
  REFUNDED: { label: "Refunded", className: "badge-blue" },
};

export default function MyPaymentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.MY_PAYMENTS,
    queryFn: () => paymentService.getMyPayments(),
  });

  const payments = data?.data ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="My Payments"
        description="Your payment history for purchased ideas"
        icon={CreditCard}
      />

      {isLoading ? (
        <div className="glass gradient-border rounded-2xl overflow-hidden">
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full bg-white/5 rounded-xl" />
            ))}
          </div>
        </div>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payments yet"
          description="You haven't purchased any paid ideas yet"
          actionLabel="Browse Ideas"
          onAction={() => (window.location.href = ROUTES.IDEAS)}
        />
      ) : (
        <div className="glass gradient-border rounded-2xl overflow-hidden">
          <table className="w-full table-glass">
            <thead>
              <tr>
                <th className="text-left p-4">Idea</th>
                <th className="text-left p-4 hidden md:table-cell">Amount</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4 hidden lg:table-cell">Gateway</th>
                <th className="text-left p-4 hidden md:table-cell">Date</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => {
                const config = statusConfig[payment.status] ?? {
                  label: payment.status,
                  className: "badge-purple",
                };
                return (
                  <tr key={payment.id}>
                    <td className="p-4">
                      <p className="text-white text-sm font-medium line-clamp-1 max-w-[200px]">
                        {payment.idea?.title ?? "Unknown Idea"}
                      </p>
                      {payment.idea?.category && (
                        <span className="text-white/30 text-xs">
                          {payment.idea.category.name}
                        </span>
                      )}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-white font-semibold text-sm">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`${config.className} rounded-full px-2.5 py-1 text-xs`}
                      >
                        {config.label}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="badge-purple rounded-full px-2.5 py-1 text-xs">
                        {payment.gateway}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-white/30 text-xs">
                        {formatDate(payment.createdAt)}
                      </span>
                    </td>
                    <td className="p-4">
                      {payment.idea && payment.status === "SUCCESS" && (
                        <Link href={ROUTES.IDEA_DETAILS(payment.ideaId)}>
                          <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-purple-400 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}