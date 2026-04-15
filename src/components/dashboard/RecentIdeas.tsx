"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";
import { ideaService } from "@/services/idea.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import IdeaStatusBadge from "@/components/idea/IdeaStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { TIdea } from "@/types/idea.types";

type TProps = { limit?: number };

export default function RecentIdeas({ limit = 5 }: TProps) {
  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.MY_IDEAS, limit],
    queryFn: () => ideaService.getMyIdeas({ limit }),
  });

  const ideas = data?.data?.data ?? [];

  return (
    <div className="glass gradient-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-purple-400" />
          <h3 className="text-white font-semibold text-sm">My Recent Ideas</h3>
        </div>
        <Link href={ROUTES.MEMBER_IDEAS}>
          <span className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </span>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-10 h-10 rounded-xl bg-white/5 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4 bg-white/5" />
                <Skeleton className="h-3 w-1/2 bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-white/30 text-sm">No ideas yet</p>
          <Link href={ROUTES.MEMBER_CREATE_IDEA}>
            <span className="text-purple-400 hover:text-purple-300 text-xs mt-1 inline-block transition-colors">
              Create your first idea →
            </span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {ideas.map((idea: TIdea) => (
            <Link key={idea.id} href={ROUTES.IDEA_DETAILS(idea.id)}>
              <div className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
                <div className="w-10 h-10 rounded-xl glass-purple flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm font-medium truncate group-hover:text-purple-300 transition-colors">
                    {idea.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <IdeaStatusBadge status={idea.status} className="text-[10px] px-2 py-0.5" />
                    <span className="text-white/30 text-xs">{formatDate(idea.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}