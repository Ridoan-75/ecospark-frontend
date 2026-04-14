"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageSquare, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { TComment } from "@/types/comment.types";
import { formatDate, getInitials } from "@/lib/utils";
import { commentService } from "@/services/comment.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import CommentForm from "./CommentForm";
import ReplyCard from "./ReplyCard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

type TProps = { comment: TComment; ideaId: string };

export default function CommentCard({ comment, ideaId }: TProps) {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isOwner = user?.id === comment.authorId;
  const canDelete = isOwner || isAdmin;
  const replyCount = comment.replies?.length ?? 0;

  const { mutate: deleteComment, isPending: deleting } = useMutation({
    mutationFn: () => commentService.deleteComment(comment.id),
    onSuccess: () => {
      toast.success("Comment deleted");
      setDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS(ideaId), refetchType: 'active' });
    },
    onError: () => toast.error("Failed to delete comment"),
  });

  return (
    <div className="glass rounded-xl p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {getInitials(comment.author.name)}
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium">
              {comment.author.name}
            </p>
            <p className="text-white/30 text-xs">
              {formatDate(comment.createdAt)}
            </p>
          </div>
        </div>

        {canDelete && (
          <button
            onClick={() => setDeleteOpen(true)}
            className="text-white/20 hover:text-red-400 transition-colors p-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Body */}
      <p className="text-white/65 text-sm leading-relaxed mb-3">
        {comment.body}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="flex items-center gap-1.5 text-white/30 hover:text-purple-400 text-xs transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Reply
        </button>

        {replyCount > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs transition-colors"
          >
            {showReplies ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
            {replyCount} {replyCount === 1 ? "reply" : "replies"}
          </button>
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-3 pl-4 border-l border-white/10">
          <CommentForm
            ideaId={ideaId}
            parentId={comment.id}
            placeholder="Write a reply..."
            compact
            onSuccess={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {/* Replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 pl-4 border-l border-white/10 space-y-3">
          {comment.replies.map((reply) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              ideaId={ideaId}
            />
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => deleteComment()}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}