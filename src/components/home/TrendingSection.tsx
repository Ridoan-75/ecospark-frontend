"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, ArrowRight, Eye, ArrowUp, Sparkles, Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { aiService } from "@/services/ai.service";
import { ROUTES } from "@/constants/routes";
import type { TIdea } from "@/types/idea.types";

export default function TrendingSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["ai", "trending"],
    queryFn: () => aiService.getTrendingIdeas(),
  });

  const ideas: TIdea[] = data?.data?.ideas ?? data?.data ?? [];
  const topIdeas = ideas.slice(0, 6);

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute top-0 right-0 w-100 h-100 bg-orange-600/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-4">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-purple-300 text-sm font-medium">Trending Now</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What&apos;s <span className="gradient-text">Hot</span> This Week
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            The most viewed and discussed sustainability ideas right now
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <Skeleton className="h-40 w-full bg-white/5" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-white/5" />
                  <Skeleton className="h-3 w-full bg-white/5" />
                  <div className="flex gap-3 pt-1">
                    <Skeleton className="h-3 w-12 bg-white/5" />
                    <Skeleton className="h-3 w-12 bg-white/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : topIdeas.length === 0 ? null : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topIdeas.map((idea, index) => (
              <Link key={idea.id} href={ROUTES.IDEA_DETAILS(idea.id)}>
                <div className="glass glass-hover gradient-border rounded-2xl overflow-hidden group cursor-pointer h-full flex flex-col">
                  <div className="relative h-40 overflow-hidden shrink-0">
                    {idea.images?.[0] ? (
                      <Image
                        src={idea.images[0]}
                        alt={idea.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-orange-900/30 to-dark-400 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-orange-400/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-dark-400/90 via-dark-400/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold px-2.5 py-1 rounded-full">
                        <Flame className="w-3 h-3" />
                        #{index + 1}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-xs text-purple-400 font-medium mb-1.5">
                      {idea.category?.name}
                    </span>
                    <h3 className="text-white font-semibold text-sm leading-snug mb-3 group-hover:text-purple-300 transition-colors line-clamp-2 flex-1">
                      {idea.title}
                    </h3>
                    <div className="flex items-center gap-4 pt-3 border-t border-white/8 text-xs text-white/40">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-purple-400" />
                        <span>{idea.viewCount} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUp className="w-3 h-3 text-green-400" />
                        <span>{idea._count?.votes ?? 0} votes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href={`${ROUTES.IDEAS}?sortBy=most_viewed`}>
            <button className="btn-glass text-white/60 hover:text-white px-8 py-2.5 rounded-xl gap-2 inline-flex items-center text-sm font-medium transition-all group">
              See All Trending
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
