"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { paymentService } from "@/services/payment.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const statusClass: Record<string, string> = {
  SUCCESS: "badge-green",
  PENDING: "badge-amber",
  FAILED: "badge-red",
  REFUNDED: "badge-blue",
};

export default function PaymentTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_PAYMENTS, page, status],
    queryFn: () => paymentService.getAdminAll({ page, limit: 10, status: status || undefined }),
  });

  const payments = ((data?.data as Record<string, unknown>)?.data as Record<string, unknown>)?.payments as Array<{id: string; user?: {profileImage?: string; name?: string; email?: string}; idea?: {title?: string}; amount: number; status: string; createdAt: string}> ?? [];
  const meta = (data?.data as Record<string, unknown>)?.meta as undefined | {totalPage: number};
  const stats = ((data?.data as Record<string, unknown>)?.data as Record<string, unknown>)?.stats as undefined | {totalRevenue: number; totalSuccessfulPayments: number};

  return (
    <div className="space-y-4">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4">
          <div className="glass gradient-border rounded-xl p-4">
            <p className="text-white/40 text-xs mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div className="glass gradient-border rounded-xl p-4">
            <p className="text-white/40 text-xs mb-1">Successful Payments</p>
            <p className="text-2xl font-bold text-white">{stats.totalSuccessfulPayments}</p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-3">
        <Select value={status || "all"} onValueChange={(v) => { setStatus(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="input-glass h-10 rounded-xl w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-white/10 text-white">
            <SelectItem value="all" className="hover:bg-white/10 focus:bg-white/10">All Status</SelectItem>
            <SelectItem value="SUCCESS" className="hover:bg-white/10 focus:bg-white/10">Success</SelectItem>
            <SelectItem value="PENDING" className="hover:bg-white/10 focus:bg-white/10">Pending</SelectItem>
            <SelectItem value="FAILED" className="hover:bg-white/10 focus:bg-white/10">Failed</SelectItem>
            <SelectItem value="REFUNDED" className="hover:bg-white/10 focus:bg-white/10">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass gradient-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-glass">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Idea</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><Skeleton className="h-4 bg-white/5 rounded" /></td>
                  ))}</tr>
                ))
              ) : payments.length === 0 ? (
                <tr><td colSpan={5}><EmptyState icon={CreditCard} title="No payments found" /></td></tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-7 h-7">
                          <AvatarImage src={p.user?.profileImage || ""} />
                          <AvatarFallback className="bg-purple-600 text-white text-xs">{getInitials(p.user?.name ?? "U")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white/80 text-xs font-medium">{p.user?.name ?? "—"}</p>
                          <p className="text-white/30 text-[10px]">{p.user?.email ?? "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs max-w-36">
                      <p className="line-clamp-1">{p.idea?.title ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-green-400 font-semibold text-sm">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-xs", statusClass[p.status] ?? "badge-blue")}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs">{formatDate(p.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {meta && meta.totalPage > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-white/8">
            {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${p === page ? "btn-glow text-white" : "glass text-white/50 hover:text-white"}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}