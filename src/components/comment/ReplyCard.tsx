"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { TComment } from "@/types/comment.types";
import { formatDate, getInitials } from "@/lib/utils";
import { commentService } from "@/services/comment.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

type TProps = { reply: TComment; ideaId: string };

export default function ReplyCard({ reply, ideaId }: TProps) {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isOwner = user?.id === reply.authorId;
  const canDelete = isOwner || isAdmin;

  const { mutate: deleteReply, isPending: deleting } = useMutation({
    mutationFn: () => commentService.deleteComment(reply.id),
    onSuccess: () => {
      toast.success("Reply deleted");
      setDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMENTS(ideaId) });
    },
    onError: () => toast.error("Failed to delete reply"),
  });

  return (
    <div className="glass-purple rounded-lg p-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            {getInitials(reply.author.name)}
          </div>
          <div>
            <p className="text-white/70 text-xs font-medium">
              {reply.author.name}
            </p>
            <p className="text-white/25 text-[10px]">
              {formatDate(reply.createdAt)}
            </p>
          </div>
        </div>

        {canDelete && (
          <button
            onClick={() => setDeleteOpen(true)}
            className="text-white/20 hover:text-red-400 transition-colors p-0.5"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      <p className="text-white/55 text-xs leading-relaxed">{reply.body}</p>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Reply"
        description="Are you sure you want to delete this reply?"
        confirmLabel="Delete"
        onConfirm={() => deleteReply()}
        loading={deleting}
        variant="danger"
      />
    </div>
  );
}