"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { voteService } from "@/services/vote.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

type TProps = { ideaId: string; initialUserVote?: "UP" | "DOWN" | null };

export default function VoteButtons({ ideaId, initialUserVote }: TProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: statsData } = useQuery({
    queryKey: QUERY_KEYS.VOTE_STATS(ideaId),
    queryFn: () => voteService.getStats(ideaId),
  });

  const stats = statsData?.data;
  const upVotes = stats?.upVotes ?? 0;
  const downVotes = stats?.downVotes ?? 0;
  const userVote = stats?.userVote ?? initialUserVote ?? null;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VOTE_STATS(ideaId), refetchType: 'active' });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.IDEA(ideaId), refetchType: 'active' });
  };

  const { mutate: castVote, isPending } = useMutation({
    mutationFn: ({ type }: { type: "UP" | "DOWN" }) =>
      voteService.castVote(ideaId, type),
    onSuccess: (res) => {
      toast.success(res.message || "Vote submitted successfully!", {
        duration: 3000,
      });
      invalidate();
    },
    onError: (err: unknown) => {
      let errorMessage = "Failed to vote";
      if (err instanceof Object && 'response' in err) {
        const response = (err as Record<string, unknown>).response;
        if (response instanceof Object && 'data' in response) {
          const data = (response as Record<string, unknown>).data;
          if (data instanceof Object && 'message' in data) {
            errorMessage = (data as Record<string, string>).message;
          }
        }
      }
      toast.error(errorMessage, {
        duration: 5000,
      });
    },
  });

  const handleVote = (type: "UP" | "DOWN") => {
    if (!isAuthenticated) {
      toast.error("Please login to vote", {
        duration: 4000,
      });
      router.push(ROUTES.LOGIN);
      return;
    }
    castVote({ type });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Upvote */}
      <button
        onClick={() => handleVote("UP")}
        disabled={isPending}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border",
          userVote === "UP"
            ? "bg-green-500/20 border-green-500/40 text-green-400"
            : "glass border-white/10 text-white/50 hover:text-green-400 hover:border-green-500/30"
        )}
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{upVotes}</span>
      </button>

      {/* Score */}
      <div className={cn(
        "px-3 py-2 rounded-xl text-sm font-bold glass border border-white/10",
        (upVotes - downVotes) > 0 ? "text-green-400" :
        (upVotes - downVotes) < 0 ? "text-red-400" : "text-white/40"
      )}>
        {upVotes - downVotes > 0 ? "+" : ""}{upVotes - downVotes}
      </div>

      {/* Downvote */}
      <button
        onClick={() => handleVote("DOWN")}
        disabled={isPending}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border",
          userVote === "DOWN"
            ? "bg-red-500/20 border-red-500/40 text-red-400"
            : "glass border-white/10 text-white/50 hover:text-red-400 hover:border-red-500/30"
        )}
      >
        <ThumbsDown className="w-4 h-4" />
        <span>{downVotes}</span>
      </button>
    </div>
  );
}