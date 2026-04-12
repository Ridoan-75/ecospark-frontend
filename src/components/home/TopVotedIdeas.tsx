"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { ArrowUp, ArrowRight, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ideaService } from "@/services/idea.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { truncateText } from "@/lib/utils";

export default function TopVotedIdeas() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.TOP_VOTED_IDEAS,
    queryFn: () => ideaService.getTopVoted(3),
  });

  const ideas = data?.data ?? [];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-4">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-purple-300 text-sm font-medium">Top Voted</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">
            Community <span className="gradient-text">Favorites</span>
          </h2>
          <p className="text-white/40 max-w-md mx-auto text-base">
            The ideas that our community loves the most
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <Skeleton className="h-40 bg-white/5" />
                <div className="p-5 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-white/5" />
                  <Skeleton className="h-3 w-full bg-white/5" />
                  <Skeleton className="h-3 w-10 bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ideas.map((idea, index) => (
              <Link key={idea.id} href={ROUTES.IDEA_DETAILS(idea.id)}>
                <div className="glass glass-hover gradient-border rounded-2xl overflow-hidden group h-full flex flex-col relative">
                  {/* Rank badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                      index === 0 ? "bg-amber-500/30 border-amber-500/50 text-amber-300" :
                      index === 1 ? "bg-slate-400/20 border-slate-400/40 text-slate-300" :
                      "bg-orange-700/20 border-orange-700/40 text-orange-400"
                    }`}>
                      #{index + 1}
                    </div>
                  </div>

                  <div className="relative h-40 overflow-hidden">
                    {idea.images?.[0] ? (
                      <Image src={idea.images[0]} alt={idea.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-dark-400 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-purple-400/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-400/90 to-transparent" />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <span className="badge-purple rounded-full px-2.5 py-1 text-xs inline-block mb-2 self-start">
                      {idea.category.name}
                    </span>
                    <h3 className="text-white font-semibold text-sm leading-snug mb-2 group-hover:text-purple-300 transition-colors line-clamp-2 flex-1">
                      {idea.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-green-400 text-sm font-medium mt-2">
                      <ArrowUp className="w-4 h-4" />
                      <span>{idea._count?.votes ?? 0} votes</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href={`${ROUTES.IDEAS}?sortBy=top_voted`}>
            <Button className="btn-glass text-white/70 hover:text-white px-8 rounded-xl gap-2 group">
              See All Top Ideas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}