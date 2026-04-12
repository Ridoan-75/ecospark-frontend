"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import {
  Plus,
  Lightbulb,
  Edit,
  Trash2,
  Send,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { ideaService } from "@/services/idea.service";
import { TIdea } from "@/types/idea.types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import IdeaStatusBadge from "@/components/idea/IdeaStatusBadge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MyIdeasPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<TIdea | null>(null);
  const [submitTarget, setSubmitTarget] = useState<TIdea | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.MY_IDEAS, statusFilter],
    queryFn: () =>
      ideaService.getMyIdeas({
        limit: 100,
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
  });

  const ideas = data?.data?.data ?? [];

  const { mutate: deleteIdea, isPending: deleting } = useMutation({
    mutationFn: (id: string) => ideaService.deleteIdea(id),
    onSuccess: () => {
      toast.success("Idea deleted successfully");
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_IDEAS });
    },
    onError: (err: AxiosError<Record<string, unknown>>) => {
      toast.error((err?.response?.data?.message as string) || "Failed to delete idea");
    },
  });

  const { mutate: submitIdea, isPending: submitting } = useMutation({
    mutationFn: (id: string) => ideaService.submit(id),
    onSuccess: () => {
      toast.success("Idea submitted for review!");
      setSubmitTarget(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_IDEAS });
    },
    onError: (err: AxiosError<Record<string, unknown>>) => {
      toast.error((err?.response?.data?.message as string) || "Failed to submit idea");
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="My Ideas"
        description="Manage and track your sustainability ideas"
        icon={Lightbulb}
        actionLabel="New Idea"
        actionIcon={Plus}
        onAction={() => window.location.href = ROUTES.MEMBER_CREATE_IDEA}
      />

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="input-glass h-10 rounded-xl w-48">
            <SelectValue placeholder="Filter by status" />
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
        <span className="text-white/30 text-sm">
          {ideas.length} ideas
        </span>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="glass gradient-border rounded-2xl overflow-hidden">
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full bg-white/5 rounded-xl" />
            ))}
          </div>
        </div>
      ) : ideas.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="No ideas yet"
          description="Start by creating your first sustainability idea"
          actionLabel="Create Idea"
          onAction={() => window.location.href = ROUTES.MEMBER_CREATE_IDEA}
        />
      ) : (
        <div className="glass gradient-border rounded-2xl overflow-hidden">
          <table className="w-full table-glass">
            <thead>
              <tr>
                <th className="text-left p-4">Title</th>
                <th className="text-left p-4 hidden md:table-cell">Category</th>
                <th className="text-left p-4 hidden lg:table-cell">Type</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4 hidden md:table-cell">Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((idea) => (
                <tr key={idea.id}>
                  <td className="p-4">
                    <p className="text-white text-sm font-medium line-clamp-1 max-w-[200px]">
                      {idea.title}
                    </p>
                    {idea.status === "REJECTED" && idea.rejectionFeedback && (
                      <p className="text-red-400 text-xs mt-0.5 line-clamp-1">
                        ⚠ {idea.rejectionFeedback}
                      </p>
                    )}
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="badge-purple rounded-full px-2.5 py-1 text-xs">
                      {idea.category.name}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        idea.isPaid ? "badge-amber" : "badge-green"
                      }`}
                    >
                      {idea.isPaid
                        ? `Paid · ${formatCurrency(idea.price!)}`
                        : "Free"}
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
                      {/* View */}
                      <Link href={ROUTES.IDEA_DETAILS(idea.id)}>
                        <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-purple-400 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </Link>

                      {/* Edit — DRAFT or REJECTED only */}
                      {(idea.status === "DRAFT" ||
                        idea.status === "REJECTED") && (
                        <Link href={ROUTES.MEMBER_EDIT_IDEA(idea.id)}>
                          <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-blue-400 transition-colors">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                      )}

                      {/* Submit — DRAFT only */}
                      {idea.status === "DRAFT" && (
                        <button
                          onClick={() => setSubmitTarget(idea)}
                          className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-green-400 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete — DRAFT or REJECTED only */}
                      {(idea.status === "DRAFT" ||
                        idea.status === "REJECTED") && (
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

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete Idea"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && deleteIdea(deleteTarget.id)}
        loading={deleting}
        variant="danger"
      />

      {/* Submit Confirm */}
      <ConfirmDialog
        open={!!submitTarget}
        onOpenChange={(o) => !o && setSubmitTarget(null)}
        title="Submit for Review"
        description={`Submit "${submitTarget?.title}" for admin review? You won't be able to edit it until it's reviewed.`}
        confirmLabel="Submit"
        onConfirm={() => submitTarget && submitIdea(submitTarget.id)}
        loading={submitting}
        variant="default"
      />
    </div>
  );
}