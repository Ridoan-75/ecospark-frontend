"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Lightbulb, CheckCircle2, XCircle, Eye, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { ideaService } from "@/services/idea.service";
import { TIdea } from "@/types/idea.types";
import { formatDate } from "@/lib/utils";
import IdeaStatusBadge from "@/components/idea/IdeaStatusBadge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import { useDebounce } from "@/hooks/useDebounce";

export default function AdminIdeasPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [approveTarget, setApproveTarget] = useState<TIdea | null>(null);
  const [rejectTarget, setRejectTarget] = useState<TIdea | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TIdea | null>(null);
  const [feedback, setFeedback] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_IDEAS, debouncedSearch, statusFilter],
    queryFn: () =>
      ideaService.getAdminAll({
        searchTerm: debouncedSearch || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        limit: 100,
      }),
  });

  const ideas = data?.data ?? [];


  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_IDEAS, refetchType: 'active' });
  };

  const { mutate: approveIdea, isPending: approving } = useMutation({
    mutationFn: (id: string) => ideaService.approve(id),
    onSuccess: () => {
      toast.success("Idea approved successfully! ✅");
      setApproveTarget(null);
      invalidate();
    },
    onError: (err: AxiosError<Record<string, unknown>>) => {
      toast.error((err?.response?.data?.message as string) || "Failed to approve");
    },
  });

  const { mutate: rejectIdea, isPending: rejecting } = useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback: string }) =>
      ideaService.reject(id, feedback),
    onSuccess: () => {
      toast.success("Idea rejected with feedback");
      setRejectTarget(null);
      setFeedback("");
      invalidate();
    },
    onError: (err: AxiosError<Record<string, unknown>>) => {
      toast.error((err?.response?.data?.message as string) || "Failed to reject");
    },
  });

  const { mutate: deleteIdea, isPending: deleting } = useMutation({
    mutationFn: (id: string) => ideaService.deleteIdeaAdmin(id),
    onSuccess: () => {
      toast.success("Idea deleted successfully ✅");
      setDeleteTarget(null);
      invalidate();
    },
    onError: (err: AxiosError<Record<string, unknown>>) => {
      toast.error((err?.response?.data?.message as string) || "Failed to delete");
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Manage Ideas"
        description="Review, approve and reject submitted ideas"
        icon={Lightbulb}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            placeholder="Search ideas or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-glass pl-10 h-10 rounded-xl"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="input-glass h-10 rounded-xl w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-white/10 text-white">
            {["all", "DRAFT", "UNDER_REVIEW", "APPROVED", "REJECTED"].map(
              (s) => (
                <SelectItem
                  key={s}
                  value={s}
                  className="hover:bg-white/10 focus:bg-white/10"
                >
                  {s === "all" ? "All Status" : s.replace("_", " ")}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        <span className="text-white/30 text-sm self-center">
          {ideas.length} ideas
        </span>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="glass gradient-border rounded-2xl p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full bg-white/5 rounded-xl" />
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <EmptyState icon={Lightbulb} title="No ideas found" />
      ) : (
        <div className="glass gradient-border rounded-2xl overflow-hidden">
          <table className="w-full table-glass">
            <thead>
              <tr>
                <th className="text-left p-4">Idea</th>
                <th className="text-left p-4 hidden md:table-cell">Author</th>
                <th className="text-left p-4 hidden lg:table-cell">Category</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4 hidden md:table-cell">Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((idea: TIdea) => (
                <tr key={idea.id}>
                  <td className="p-4">
                    <p className="text-white text-sm font-medium line-clamp-1 max-w-45">
                      {idea.title}
                    </p>
                    {idea.isPaid && (
                      <span className="badge-amber rounded-full px-2 py-0.5 text-[10px]">
                        Paid
                      </span>
                    )}
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-white/50 text-sm">
                      {idea.author.name}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className="badge-purple rounded-full px-2.5 py-1 text-xs">
                      {idea.category.name}
                    </span>
                  </td>
                  <td className="p-4">
                    <IdeaStatusBadge status={idea.status} />
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-white/30 text-xs">
                      {formatDate(idea.createdAt)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <Link href={ROUTES.IDEA_DETAILS(idea.id)}>
                        <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-purple-400 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </Link>

                      {idea.status === "UNDER_REVIEW" && (
                        <>
                          <button
                            onClick={() => setApproveTarget(idea)}
                            className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-green-400 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setRejectTarget(idea)}
                            className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {idea.status === "APPROVED" && (
                        <button
                          onClick={() => setDeleteTarget(idea)}
                          className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Approve Confirm */}
      <ConfirmDialog
        open={!!approveTarget}
        onOpenChange={(o) => !o && setApproveTarget(null)}
        title="Approve Idea"
        description={`Approve "${approveTarget?.title}"? It will become publicly visible.`}
        confirmLabel="Approve"
        onConfirm={() => approveTarget && approveIdea(approveTarget.id)}
        loading={approving}
        variant="default"
      />

      {/* Reject Dialog */}
      <Dialog
        open={!!rejectTarget}
        onOpenChange={(o) => {
          if (!o) {
            setRejectTarget(null);
            setFeedback("");
          }
        }}
      >
        <DialogContent className="glass border-white/10 bg-dark-200/95 backdrop-blur-xl text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Reject Idea</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-white/50 text-sm">
              Rejecting:{" "}
              <span className="text-white">{rejectTarget?.title}</span>
            </p>
            <div className="space-y-2">
              <label className="text-white/70 text-sm">
                Feedback (required)
              </label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Explain why this idea is being rejected..."
                rows={4}
                className="input-glass rounded-xl resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setRejectTarget(null);
                  setFeedback("");
                }}
                className="flex-1 btn-glass text-white/60"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  rejectTarget &&
                  feedback.trim().length >= 10 &&
                  rejectIdea({ id: rejectTarget.id, feedback })
                }
                disabled={rejecting || feedback.trim().length < 10}
                className="flex-1 bg-red-500/80 hover:bg-red-500 text-white border-0"
              >
                {rejecting ? "Rejecting..." : "Reject"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Idea"
        description={`Delete "${deleteTarget?.title}"? This action cannot be undone. All associated data will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && deleteIdea(deleteTarget.id)}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}