"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { ideaService } from "@/services/idea.service";
import { TIdea } from "@/types/idea.types";
import { formatCurrency, truncateText } from "@/lib/utils";
import {
  ArrowUpIcon,
  ArrowRight,
  MessageSquare,
  Eye,
  Lock,
  Sparkles,
} from "lucide-react";

export default function FeaturedIdeas() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.TOP_VOTED_IDEAS,
    queryFn: () => ideaService.getTopVoted(6),
  });

  const ideas: TIdea[] = data?.data || [];

  return (
    <section className="py-24 px-4 relative">

      {/* Section Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              Community Highlights
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured{" "}
            <span className="gradient-text">Sustainability Ideas</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Discover the most impactful ideas voted by our community members
          </p>
        </div>

        {/* Ideas Grid */}
        {isLoading ? (
          <FeaturedIdeasSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea, index) => (
              <IdeaCard key={idea.id} idea={idea} index={index} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href={ROUTES.IDEAS}>
            <Button
              size="lg"
              variant="outline"
              className="glass border-white/15 text-white/80 hover:text-white hover:bg-white/10 px-8 rounded-xl gap-2 group"
            >
              View All Ideas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Idea Card ─────────────────────────────────────────
function IdeaCard({ idea, index }: { idea: TIdea; index: number }) {
  return (
    <Link href={ROUTES.IDEA_DETAILS(idea.id)}>
      <div
        className="glass glass-hover gradient-border rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {idea.images?.[0] ? (
            <Image
              src={idea.images[0]}
              alt={idea.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-purple-gradient opacity-20 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-purple-400/50" />
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-dark-400/80 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="glass-purple border-purple-500/30 text-purple-300 text-xs">
              {idea.category.name}
            </Badge>
            {idea.isPaid && (
              <Badge className="bg-amber-500/20 border-amber-500/30 text-amber-300 text-xs gap-1">
                <Lock className="w-2.5 h-2.5" />
                {formatCurrency(idea.price!)}
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">

          {/* Title */}
          <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-purple-300 transition-colors">
            {idea.title}
          </h3>

          {/* Description */}
          <p className="text-white/50 text-sm leading-relaxed flex-1 mb-4">
            {truncateText(idea.description, 100)}
          </p>

          {/* Author */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-purple-gradient flex items-center justify-center text-white text-xs font-bold">
              {idea.author.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-white/40 text-xs">{idea.author.name}</span>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 pt-3 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-white/50 text-xs">
              <ArrowUpIcon className="w-3.5 h-3.5 text-green-400" />
              <span>{idea._count?.votes ?? 0} votes</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50 text-xs">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>{idea._count?.comments ?? 0} comments</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50 text-xs ml-auto">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              <span>{idea.viewCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Skeleton ──────────────────────────────────────────
function FeaturedIdeasSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass rounded-2xl overflow-hidden">
          <Skeleton className="h-48 w-full bg-white/5" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-4 w-3/4 bg-white/5" />
            <Skeleton className="h-3 w-full bg-white/5" />
            <Skeleton className="h-3 w-2/3 bg-white/5" />
            <div className="flex gap-4 pt-2">
              <Skeleton className="h-3 w-16 bg-white/5" />
              <Skeleton className="h-3 w-16 bg-white/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}