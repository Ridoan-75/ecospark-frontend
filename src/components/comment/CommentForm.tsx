"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { commentService } from "@/services/comment.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

type TProps = {
  ideaId: string;
  parentId?: string | null;
  onSuccess?: () => void;
  placeholder?: string;
  compact?: boolean;
};

export default function CommentForm({
  ideaId,
  parentId = null,
  onSuccess,
  placeholder = "Share your thoughts...",
  compact = false,
}: TProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () => commentService.create({ body, ideaId, parentId }),
    onSuccess: () => {
      toast.success(parentId ? "Reply added!" : "Comment added!");
      setBody("");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMMENTS(ideaId),
      });
      onSuccess?.();
    },
    onError: (err: unknown) => {
      let errorMessage = "Failed to add comment";
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

  const handleSubmit = () => {
    if (!isAuthenticated) {
      toast.error("Please login to comment");
      router.push(ROUTES.LOGIN);
      return;
    }
    if (!body.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    mutate();
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        rows={compact ? 2 : 3}
        className="input-glass rounded-xl resize-none text-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
        }}
      />
      <div className="flex items-center justify-between">
        <span className="text-white/20 text-xs">Ctrl+Enter to submit</span>
        <Button
          onClick={handleSubmit}
          disabled={isPending || !body.trim()}
          className="btn-glow text-white border-0 h-8 px-4 rounded-lg text-xs gap-1.5"
        >
          {isPending ? (
            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-3 h-3" />
          )}
          {parentId ? "Reply" : "Comment"}
        </Button>
      </div>
    </div>
  );
}