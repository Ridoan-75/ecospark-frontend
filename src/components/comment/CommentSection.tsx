"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageSquare } from "lucide-react";
import { commentService } from "@/services/comment.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { TComment } from "@/types/comment.types";
import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";

type TProps = { ideaId: string };

export default function CommentSection({ ideaId }: TProps) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: QUERY_KEYS.COMMENTS(ideaId),
    queryFn: () => commentService.getByIdeaId(ideaId, { limit: 50 }),
    refetchOnWindowFocus: true,
  });

  const comments = data?.data?.data ?? [];
  const total = data?.data?.meta?.total ?? 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <MessageSquare className="w-5 h-5 text-purple-400" />
        <h2 className="text-white font-semibold text-lg">
          Comments
          {total > 0 && (
            <span className="ml-2 text-white/30 font-normal text-base">
              ({total})
            </span>
          )}
        </h2>
      </div>

      {/* Add Comment */}
      <div className="glass gradient-border rounded-xl p-4 mb-6">
        <p className="text-white/50 text-xs mb-3">Add a comment</p>
        <CommentForm ideaId={ideaId} onSuccess={() => refetch()} />
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full bg-white/5" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24 bg-white/5" />
                  <Skeleton className="h-2.5 w-16 bg-white/5" />
                </div>
              </div>
              <Skeleton className="h-3 w-full bg-white/5" />
              <Skeleton className="h-3 w-3/4 bg-white/5" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No comments yet"
          description="Be the first to share your thoughts on this idea!"
        />
      ) : (
        <div className="space-y-4">
          {comments.map((comment: TComment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              ideaId={ideaId}
            />
          ))}
        </div>
      )}
    </div>
  );
}