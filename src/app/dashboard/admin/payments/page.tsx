"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { paymentService } from "@/services/payment.service";
import { formatDate, formatCurrency } from "@/lib/utils";
import { TPayment } from "@/types/payment.types";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/dashboard/StatCard";

const statusConfig: Record<string, { label: string; className: string }> = {
  SUCCESS: { label: "Success", className: "badge-green" },
  PENDING: { label: "Pending", className: "badge-amber" },
  FAILED: { label: "Failed", className: "badge-red" },
  REFUNDED: { label: "Refunded", className: "badge-blue" },
};

export default function AdminPaymentsPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_PAYMENTS, statusFilter],
    queryFn: () =>
      paymentService.getAdminAll({
        status: statusFilter === "all" ? undefined : statusFilter,
        limit: 100,
      }),
  });

  const payments = data?.data?.payments ?? [];
  const stats = data?.data?.stats;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Payments"
        description="All platform payment transactions"
        icon={CreditCard}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          icon={TrendingUp}
          color="green"
          subtitle={`${stats?.totalSuccessfulPayments ?? 0} successful`}
        />
        <StatCard
          title="Total Transactions"
          value={payments.length}
          icon={CreditCard}
          color="purple"
        />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="input-glass h-10 rounded-xl w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-white/10 text-white">
            {["all", "SUCCESS", "PENDING", "FAILED", "REFUNDED"].map((s) => (
              <SelectItem
                key={s}
                value={s}
                className="hover:bg-white/10 focus:bg-white/10"
              >
                {s === "all" ? "All Status" : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-white/30 text-sm">
          {payments.length} transactions
        </span>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="glass gradient-border rounded-2xl p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full bg-white/5 rounded-xl" />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <EmptyState icon={CreditCard} title="No payments found" />
      ) : (
        <div className="glass gradient-border rounded-2xl overflow-hidden">
          <table className="w-full table-glass">
            <thead>
              <tr>
                <th className="text-left p-4">User</th>
                <th className="text-left p-4 hidden md:table-cell">Idea</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4 hidden lg:table-cell">Gateway</th>
                <th className="text-left p-4 hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment: TPayment) => {
                const config = statusConfig[payment.status] ?? {
                  label: payment.status,
                  className: "badge-purple",
                };
                return (
                  <tr key={payment.id}>
                    <td className="p-4">
                      <p className="text-white text-sm font-medium">
                        {payment.user?.name ?? "Unknown"}
                      </p>
                      <p className="text-white/30 text-xs">
                        {payment.user?.email}
                      </p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <p className="text-white/60 text-sm line-clamp-1 max-w-40">
                        {payment.idea?.title ?? "Unknown"}
                      </p>
                    </td>
                    <td className="p-4">
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