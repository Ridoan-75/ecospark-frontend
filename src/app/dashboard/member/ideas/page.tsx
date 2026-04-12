"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Plus,
  Lightbulb,
  Edit,
  Trash2,
  Send,
  Eye,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ideaService } from "@/services/idea.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { formatDate, truncateText } from "@/lib/utils";
import { TIdea } from "@/types/idea.types";
import IdeaStatusBadge from "@/components/idea/IdeaStatusBadge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EmptyState from "@/components/shared/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyIdeasPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitId, setSubmitId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.MY_IDEAS, statusFilter],
    queryFn: () =>
      ideaService.getMyIdeas({
        limit: 100,
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
  });

  const ideas: TIdea[] = data?.data?.data ?? [];

  const filtered = ideas.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  const { mutate: submitIdea, isPending: submitting } = useMutation({
    mutationFn: (id: string) => ideaService.submit(id),
    onSuccess: () => {
      toast.success("Idea submitted for review!");
      setSubmitId(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_IDEAS });
    },
    onError: (err: unknown) => {
      let errorMessage = "Failed to submit";
      if (err instanceof Object && 'response' in err) {
        const response = (err as Record<string, unknown>).response;
        if (response instanceof Object && 'data' in response) {
          const data = (response as Record<string, unknown>).data;
          if (data instanceof Object && 'message' in data) {
            errorMessage = (data as Record<string, string>).message;
          }
        }
      }
      toast.error(errorMessage);
    },
  });

  const { mutate: deleteIdea, isPending: deleting } = useMutation({
    mutationFn: (id: string) => ideaService.deleteIdea(id),
    onSuccess: () => {
      toast.success("Idea deleted successfully");
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_IDEAS });
    },
    onError: (err: unknown) => {
      let errorMessage = "Failed to delete";
      if (err instanceof Object && 'response' in err) {
        const response = (err as Record<string, unknown>).response;
        if (response instanceof Object && 'data' in response) {
          const data = (response as Record<string, unknown>).data;
          if (data instanceof Object && 'message' in data) {
            errorMessage = (data as Record<string, string>).message;
          }
        }
      }
      toast.error(errorMessage);
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="My Ideas"
        description="Manage and track all your submitted ideas"
        icon={Lightbulb}
        actionLabel="New Idea"
        actionIcon={Plus}
        onAction={() => router.push(ROUTES.MEMBER_CREATE_IDEA)}
      />

      {/* Filters */}
      <div className="glass gradient-border rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              placeholder="Search your ideas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-glass pl-10 h-10 rounded-xl"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="input-glass h-10 rounded-xl w-full sm:w-44">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1220] border-white/10 text-white">
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
        </div>
      </div>

      {/* Table */}
      <div className="glass gradient-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full bg-white/5 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Lightbulb}
            title="No ideas found"
            description="Start sharing your sustainability ideas with the world."
            actionLabel="Create Idea"
            onAction={() => router.push(ROUTES.MEMBER_CREATE_IDEA)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-glass">
              <thead>
                <tr>
                  <th className="text-left px-4 py-3">Idea</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((idea) => (
                  <tr key={idea.id}>
                    <td className="px-4 py-3">
                      <p className="text-white/80 text-sm font-medium">
                        {truncateText(idea.title, 45)}
                      </p>
                      {idea.isPaid && (
                        <span className="text-amber-400 text-xs">
                          Paid · ${idea.price}
                        </span>
                      )}
                      {idea.rejectionFeedback && (
                        <p className="text-red-400/70 text-xs mt-0.5 line-clamp-1">
                          Feedback: {idea.rejectionFeedback}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge-purple rounded-full px-2.5 py-1 text-xs">
                        {idea.category.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <IdeaStatusBadge status={idea.status} />
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs">
                      {formatDate(idea.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {/* View */}
                        <Link href={ROUTES.IDEA_DETAILS(idea.id)}>
                          <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-purple-400 transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </Link>

                        {/* Edit — only DRAFT or REJECTED */}
                        {(idea.status === "DRAFT" ||
                          idea.status === "REJECTED") && (
                          <Link
                            href={ROUTES.MEMBER_EDIT_IDEA(idea.id)}
                          >
                            <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-blue-400 transition-colors">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </Link>
                        )}

                        {/* Submit — only DRAFT */}
                        {idea.status === "DRAFT" && (
                          <button
                            onClick={() => setSubmitId(idea.id)}
                            className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-emerald-400 transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete — only DRAFT or REJECTED */}
                        {(idea.status === "DRAFT" ||
                          idea.status === "REJECTED") && (
                          <button
                            onClick={() => setDeleteId(idea.id)}
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
      </div>

      {/* Submit Confirm */}
      <ConfirmDialog
        open={!!submitId}
        onOpenChange={(o) => !o && setSubmitId(null)}
        title="Submit for Review"
        description="Once submitted, you won't be able to edit this idea until it's reviewed. Are you sure?"
        confirmLabel="Submit"
        onConfirm={() => submitId && submitIdea(submitId)}
        loading={submitting}
        variant="default"
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete Idea"
        description="This action cannot be undone. This idea will be permanently deleted."
        confirmLabel="Delete"
        onConfirm={() => deleteId && deleteIdea(deleteId)}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}