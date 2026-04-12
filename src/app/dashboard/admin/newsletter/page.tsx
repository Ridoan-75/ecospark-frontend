"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, Trash2, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { newsletterService } from "@/services/newsletter.service";
import { formatDate } from "@/lib/utils";

type TSubscriber = {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
};
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/dashboard/StatCard";

export default function AdminNewsletterPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_SUBSCRIBERS, activeFilter],
    queryFn: () =>
      newsletterService.getAll({
        isActive:
          activeFilter === "all" ? undefined : activeFilter === "true",
        limit: 100,
      }),
  });

  const subscribers = data?.data?.data?.subscribers ?? [];
  const stats = data?.data?.data?.stats;

  const { mutate: deleteSubscriber, isPending: deleting } = useMutation({
    mutationFn: (id: string) => newsletterService.deleteSubscriber(id),
    onSuccess: () => {
      toast.success("Subscriber removed");
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_SUBSCRIBERS });
    },
    onError: () => toast.error("Failed to remove subscriber"),
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Newsletter"
        description="Manage email subscribers"
        icon={Mail}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Active Subscribers"
          value={stats?.totalSubscribers ?? 0}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Unsubscribed"
          value={stats?.totalUnsubscribed ?? 0}
          icon={Mail}
          color="red"
        />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={activeFilter} onValueChange={setActiveFilter}>
          <SelectTrigger className="input-glass h-10 rounded-xl w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-white/10 text-white">
            <SelectItem value="all" className="hover:bg-white/10 focus:bg-white/10">All</SelectItem>
            <SelectItem value="true" className="hover:bg-white/10 focus:bg-white/10">Active</SelectItem>
            <SelectItem value="false" className="hover:bg-white/10 focus:bg-white/10">Unsubscribed</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-white/30 text-sm">
          {subscribers.length} subscribers
        </span>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="glass gradient-border rounded-2xl p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full bg-white/5 rounded-xl" />
          ))}
        </div>
      ) : subscribers.length === 0 ? (
        <EmptyState icon={Mail} title="No subscribers found" />
      ) : (
        <div className="glass gradient-border rounded-2xl overflow-hidden">
          <table className="w-full table-glass">
            <thead>
              <tr>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4 hidden md:table-cell">Subscribed</th>
                <th className="text-left p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub: TSubscriber) => (
                <tr key={sub.id}>
                  <td className="p-4">
                    <span className="text-white/80 text-sm">{sub.email}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        sub.isActive ? "badge-green" : "badge-red"
                      }`}
                    >
                      {sub.isActive ? "Active" : "Unsubscribed"}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-white/30 text-xs">
                      {formatDate(sub.createdAt)}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setDeleteTarget(sub.id)}
                      className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Remove Subscriber"
        description="Remove this subscriber from the newsletter list?"
        confirmLabel="Remove"
        onConfirm={() => deleteTarget && deleteSubscriber(deleteTarget)}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}