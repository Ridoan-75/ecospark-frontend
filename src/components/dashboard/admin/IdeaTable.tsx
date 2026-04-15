"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Trash2, Search, Eye } from "lucide-react";
import Link from "next/link";
import { ideaService } from "@/services/idea.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import IdeaStatusBadge from "@/components/idea/IdeaStatusBadge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROUTES } from "@/constants/routes";
import { TIdea } from "@/types/idea.types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function IdeaTable() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [rejectTarget, setRejectTarget] = useState<TIdea | null>(null);
  const [feedback, setFeedback] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TIdea | null>(null);
  const debounced = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_IDEAS, page, debounced, status],
    queryFn: () => ideaService.getAdminAll({ page, limit: 10, searchTerm: debounced || undefined, status: status || undefined }),
  });

  const ideas = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  const invalidate = () => qc.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_IDEAS, refetchType: 'active' });

  const { mutate: approve, isPending: approvePending } = useMutation({
    mutationFn: (id: string) => ideaService.approve(id),
    onSuccess: () => { toast.success("Idea approved!"); invalidate(); },
    onError: (e: unknown) => {
      let msg = "Failed";
      if (e instanceof Object && 'response' in e) {
        const res = (e as Record<string, unknown>).response;
        if (res instanceof Object && 'data' in res) {
          const data = (res as Record<string, unknown>).data;
          if (data instanceof Object && 'message' in data) {
            msg = (data as Record<string, string>).message;
          }
        }
      }
      toast.error(msg);
    },
  });

  const { mutate: reject, isPending: rejectPending } = useMutation({
    mutationFn: ({ id, fb }: { id: string; fb: string }) => ideaService.reject(id, fb),
    onSuccess: () => { toast.success("Idea rejected"); invalidate(); setRejectTarget(null); setFeedback(""); },
    onError: (e: unknown) => {
      let msg = "Failed";
      if (e instanceof Object && 'response' in e) {
        const res = (e as Record<string, unknown>).response;
        if (res instanceof Object && 'data' in res) {
          const data = (res as Record<string, unknown>).data;
          if (data instanceof Object && 'message' in data) {
            msg = (data as Record<string, string>).message;
          }
        }
      }
      toast.error(msg);
    },
  });

  const { mutate: deleteIdea, isPending: deletePending } = useMutation({
    mutationFn: (id: string) => ideaService.deleteIdeaAdmin(id),
    onSuccess: () => { toast.success("Idea deleted"); invalidate(); setDeleteTarget(null); },
    onError: (e: unknown) => {
      let msg = "Failed";
      if (e instanceof Object && 'response' in e) {
        const res = (e as Record<string, unknown>).response;
        if (res instanceof Object && 'data' in res) {
          const data = (res as Record<string, unknown>).data;
          if (data instanceof Object && 'message' in data) {
            msg = (data as Record<string, string>).message;
          }
        }
      }
      toast.error(msg);
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search ideas..." className="input-glass pl-10 h-10 rounded-xl" />
        </div>
        <Select value={status || "all"} onValueChange={(v) => { setStatus(v === "all" ? "" : v); setPage(1); }}>
          <SelectTrigger className="input-glass h-10 rounded-xl w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-white/10 text-white">
            <SelectItem value="all" className="hover:bg-white/10 focus:bg-white/10">All Status</SelectItem>
            <SelectItem value="UNDER_REVIEW" className="hover:bg-white/10 focus:bg-white/10">Under Review</SelectItem>
            <SelectItem value="APPROVED" className="hover:bg-white/10 focus:bg-white/10">Approved</SelectItem>
            <SelectItem value="REJECTED" className="hover:bg-white/10 focus:bg-white/10">Rejected</SelectItem>
            <SelectItem value="DRAFT" className="hover:bg-white/10 focus:bg-white/10">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="glass gradient-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-glass">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left">Idea</th>
                <th className="px-4 py-3 text-left">Author</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><Skeleton className="h-4 bg-white/5 rounded" /></td>
                  ))}</tr>
                ))
              ) : ideas.length === 0 ? (
                <tr><td colSpan={6}><EmptyState icon={Search} title="No ideas found" /></td></tr>
              ) : (
                ideas.map((idea: TIdea) => (
                  <tr key={idea.id}>
                    <td className="px-4 py-3">
                      <p className="text-white/80 text-sm font-medium line-clamp-1 max-w-48">{idea.title}</p>
                      <p className="text-white/30 text-xs">{idea.isPaid ? `$${idea.price}` : "Free"}</p>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-sm">{typeof idea.author === 'object' && idea.author !== null && 'name' in idea.author ? String((idea.author as Record<string, unknown>).name) : "—"}</td>
                    <td className="px-4 py-3"><IdeaStatusBadge status={idea.status} /></td>
                    <td className="px-4 py-3"><span className="badge-purple rounded-full px-2.5 py-1 text-xs">{idea.category.name}</span></td>
                    <td className="px-4 py-3 text-white/40 text-xs">{formatDate(idea.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={ROUTES.IDEA_DETAILS(idea.id)}>
                          <button className="p-1.5 text-white/30 hover:text-purple-400 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        {idea.status === "UNDER_REVIEW" && (
                          <>
                            <button onClick={() => approve(idea.id)} disabled={approvePending}
                              className="p-1.5 text-white/30 hover:text-green-400 transition-colors">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => { setRejectTarget(idea); setFeedback(""); }}
                              className="p-1.5 text-white/30 hover:text-red-400 transition-colors">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button onClick={() => setDeleteTarget(idea)}
                          className="p-1.5 text-white/30 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
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

      {/* Reject Dialog */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass gradient-border rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-white font-semibold mb-2">Reject Idea</h3>
            <p className="text-white/50 text-sm mb-4">Provide feedback for: <span className="text-white/70">{rejectTarget.title}</span></p>
            <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}
              placeholder="Explain why this idea is being rejected..." rows={3}
              className="input-glass rounded-xl resize-none mb-4" />
            <div className="flex gap-3">
              <Button onClick={() => setRejectTarget(null)} className="btn-glass text-white/60 hover:text-white rounded-xl flex-1">Cancel</Button>
              <Button onClick={() => { if (feedback.length >= 10) reject({ id: rejectTarget.id, fb: feedback }); else toast.error("Feedback must be at least 10 characters"); }}
                disabled={rejectPending} className="bg-red-500/80 hover:bg-red-500 text-white border-0 rounded-xl flex-1">
                {rejectPending ? "Rejecting..." : "Reject"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Idea"
        description={`Permanently delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && deleteIdea(deleteTarget.id)}
        loading={deletePending}
        variant="danger"
      />
    </div>
  );
}