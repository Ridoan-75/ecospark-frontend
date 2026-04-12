"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CreditCard, ExternalLink } from "lucide-react";
import { paymentService } from "@/services/payment.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { formatCurrency, formatDate } from "@/lib/utils";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyPaymentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.MY_PAYMENTS,
    queryFn: () => paymentService.getMyPayments(),
  });

  const payments = data?.data ?? [];

  const totalSpent = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="My Payments"
        description="Track all your purchases and payment history"
        icon={CreditCard}
      />

      {/* Summary Card */}
      <div className="glass gradient-border rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-400 to-sky-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">
            Total Spent
          </p>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(totalSpent)}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">
            Purchases
          </p>
          <p className="text-2xl font-bold text-white">
            {payments.filter((p) => p.status === "SUCCESS").length}
          </p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="glass gradient-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full bg-white/5 rounded-xl" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payments yet"
            description="Purchase a paid idea to unlock premium sustainability content."
            actionLabel="Browse Ideas"
            onAction={() => {}}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-glass">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3">Idea</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Gateway</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3">
                      <p className="text-white/80 text-sm font-medium line-clamp-1">
                        {typeof payment.idea === 'object' && payment.idea !== null && 'title' in payment.idea ? String((payment.idea as unknown as Record<string, unknown>).title) : "Idea"}
                      </p>
                      <p className="text-white/30 text-xs">
                        {typeof payment.idea === 'object' && payment.idea !== null && 'category' in payment.idea && typeof (payment.idea as unknown as Record<string, unknown>).category === 'object' ? String(((payment.idea as unknown as Record<string, unknown>).category as Record<string, unknown>).name ?? "") : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white font-semibold text-sm">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          payment.status === "SUCCESS"
                            ? "badge-green"
                            : payment.status === "PENDING"
                            ? "badge-amber"
                            : payment.status === "REFUNDED"
                            ? "badge-blue"
                            : "badge-red"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge-purple rounded-full px-2.5 py-1 text-xs">
                        {payment.gateway}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {payment.status === "SUCCESS" && typeof payment.idea === 'object' && payment.idea !== null && 'id' in payment.idea && (
                        <Link
                          href={ROUTES.IDEA_DETAILS(String((payment.idea as unknown as Record<string, unknown>).id))}
                          className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-purple-400 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}