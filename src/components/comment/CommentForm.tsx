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
import { TApiResponse, TMeta } from "@/types/common.types";
import { TComment } from "@/types/comment.types";

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

    onSuccess: (response: TApiResponse<TComment>) => {
      toast.success(parentId ? "Reply added!" : "Comment added!", {
        duration: 3000,
      });

      setBody("");

      const cacheKey = QUERY_KEYS.COMMENTS(ideaId);

      queryClient.setQueryData(cacheKey, (oldData: TApiResponse<{ data: TComment[]; meta: TMeta }> | undefined) => {
        if (!oldData?.data) return oldData;

        const currentComments = Array.isArray(oldData.data.data)
          ? oldData.data.data
          : [];

        // ✅ NEW COMMENT
        if (!parentId) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: [response?.data, ...currentComments],
              meta: {
                ...oldData.data.meta,
                total: (oldData.data.meta?.total ?? 0) + 1,
              },
            },
          };
        }

        // ✅ FIXED: REPLY ADD LOGIC
        const updatedComments = currentComments.map((comment: TComment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), response?.data],
            };
          }
          return comment;
        });

        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: updatedComments,
          },
        };
      });

      // ⚠️ only invalidate (refetchQueries remove kora hoise unnecessary)
      queryClient.invalidateQueries({ queryKey: cacheKey });

      onSuccess?.();
    },

    onError: (err: unknown) => {
      console.error("Comment error:", err);

      let errorMessage = "Failed to add comment";

      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string; error?: string } };
          message?: string;
        };

        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage, {
        duration: 5000,
      });
    },
  });

  const handleSubmit = () => {
    if (!isAuthenticated) {
      toast.error("Please login to comment", {
        duration: 4000,
      });
      router.push(ROUTES.LOGIN);
      return;
    }

    if (!body.trim()) {
      toast.error("Comment cannot be empty", {
        duration: 3000,
      });
      return;
    }

    mutate();
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={body}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setBody(e.target.value)
        }
        placeholder={placeholder}
        rows={compact ? 2 : 3}
        className="input-glass rounded-xl resize-none text-sm"
        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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