"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, Trash2 } from "lucide-react";
import { newsletterService } from "@/services/newsletter.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewsletterTable() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [isActive, setIsActive] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_SUBSCRIBERS, page, isActive],
    queryFn: () => newsletterService.getAll({ page, limit: 15, isActive: isActive === "" ? undefined : isActive === "true" }),
  });

  const subs = ((data?.data as Record<string, unknown>)?.subscribers ?? []) as Array<{id: string; email: string; isActive: boolean; createdAt: string}>;
  const stats = (data?.data as Record<string, unknown>)?.stats as undefined | {totalSubscribers: number; totalUnsubscribed: number};
  const meta = (data?.data as Record<string, unknown>)?.meta as undefined | {totalPage: number};

  const { mutate: deleteSub, isPending: deleting } = useMutation({
    mutationFn: (id: string) => newsletterService.deleteSubscriber(id),
    onSuccess: () => {
      toast.success("Subscriber deleted");
      qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_SUBSCRIBERS, refetchType: 'active' });
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete"),
  });

  return (
    <div className="space-y-4">
      {stats && (
        <div className="grid grid-cols-2 gap-4">
          <div className="glass gradient-border rounded-xl p-4">
            <p className="text-white/40 text-xs mb-1">Active Subscribers</p>
            <p className="text-2xl font-bold text-green-400">{stats.totalSubscribers}</p>
          </div>
          <div className="glass gradient-border rounded-xl p-4">
            <p className="text-white/40 text-xs mb-1">Unsubscribed</p>
            <p className="text-2xl font-bold text-white/60">{stats.totalUnsubscribed}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Select value={isActive || "all"} onValueChange={(v) => { setIsActive(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="input-glass h-10 rounded-xl w-44">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-white/10 text-white">
            <SelectItem value="all" className="hover:bg-white/10 focus:bg-white/10">All</SelectItem>
            <SelectItem value="true" className="hover:bg-white/10 focus:bg-white/10">Active</SelectItem>
            <SelectItem value="false" className="hover:bg-white/10 focus:bg-white/10">Unsubscribed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass gradient-border rounded-2xl overflow-hidden">
        <table className="w-full table-glass">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Subscribed</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>{Array.from({ length: 4 }).map((_, j) => (
                  <td key={j} className="px-4 py-3"><Skeleton className="h-4 bg-white/5 rounded" /></td>
                ))}</tr>
              ))
            ) : subs.length === 0 ? (
              <tr><td colSpan={4}><EmptyState icon={Mail} title="No subscribers yet" /></td></tr>
            ) : (
              subs.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-white/80 text-sm">{s.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={s.isActive ? "badge-green rounded-full px-2.5 py-1 text-xs" : "badge-red rounded-full px-2.5 py-1 text-xs"}>
                      {s.isActive ? "Active" : "Unsubscribed"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/40 text-xs">{formatDate(s.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteId(s.id)} className="p-1.5 text-white/30 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Subscriber"
        description="Permanently remove this subscriber from the newsletter list?"
        confirmLabel="Delete"
        onConfirm={() => deleteId && deleteSub(deleteId)}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}