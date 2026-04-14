"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { voteService } from "@/services/vote.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

type TProps = { ideaId: string; initialUserVote?: "UP" | "DOWN" | null };

export default function VoteCard({ ideaId, initialUserVote }: TProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: statsData } = useQuery({
    queryKey: QUERY_KEYS.VOTE_STATS(ideaId),
    queryFn: () => voteService.getStats(ideaId),
  });

  const stats = statsData?.data;
  const upVotes = stats?.upVotes ?? 0;
  const userVote = stats?.userVote ?? initialUserVote ?? null;
  const isLiked = userVote === "UP";

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.VOTE_STATS(ideaId),
      refetchType: "active",
    });
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.IDEA(ideaId),
      refetchType: "active",
    });
  };

  const { mutate: castVote, isPending } = useMutation({
    mutationFn: ({ type }: { type: "UP" | "DOWN" }) =>
      voteService.castVote(ideaId, type),
    onSuccess: () => {
      invalidate();
    },
    onError: () => {
      // Silent error - no toast shown
    },
  });

  const { mutate: removeVote } = useMutation({
    mutationFn: () => voteService.removeVote(ideaId),
    onSuccess: () => {
      invalidate();
    },
    onError: () => {
      // Silent error - no toast shown
    },
  });

  const handleLike = () => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }

    if (isLiked) {
      removeVote();
    } else {
      castVote({ type: "UP" });
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border-2",
        isLiked
          ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30 hover:border-red-500/60"
          : "bg-white/5 border-white/20 text-white/60 hover:bg-white/10 hover:border-red-400/50 hover:text-red-400"
      )}
    >
      <Heart
        className={cn("w-5 h-5 transition-all", isLiked ? "fill-red-400" : "")}
      />
      <span className="font-semibold">{upVotes}</span>
    </button>
  );
}
