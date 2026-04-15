"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Lock,
  Unlock,
  User,
  Tag,
  Sparkles,
  Share2,
} from "lucide-react";
import { ideaService } from "@/services/idea.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import IdeaStatusBadge from "@/components/idea/IdeaStatusBadge";
import VoteButtons from "@/components/vote/VoteButtons";
import CommentSection from "@/components/comment/CommentSection";
import PaidIdeaBanner from "@/components/idea/PaidIdeaBanner";
import { paymentService } from "@/services/payment.service";

export default function IdeaDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.IDEA(id),
    queryFn: () => ideaService.getById(id),
    staleTime: 1000 * 30, // 30 seconds
    retry: 3, // Retry 3 times with exponential backoff
  });

  const { data: accessData } = useQuery({
    queryKey: QUERY_KEYS.PAYMENT_ACCESS(id),
    queryFn: () => paymentService.checkAccess(id),
    enabled: isAuthenticated,
    staleTime: 1000 * 5, // 5 seconds
    retry: 2,
  });

  const idea = data?.data;
  const hasAccess = accessData?.data?.hasAccess ?? false;

  const isAuthor = user && idea && user.id === idea.authorId;
  const isAdmin = user?.role === "ADMIN";
  const isApproved = idea?.status === "APPROVED";
  
  // Can view page: Authors/Admins always, APPROVED ideas, or paid ideas (to show payment banner)
  const canViewIdea = isAuthor || isAdmin || isApproved || idea?.isPaid;
  
  // Can view full content: only if not paid OR user has access
  const canViewFull =
    canViewIdea && (!idea?.isPaid || isAuthor || hasAccess || isAdmin);

  if (isLoading || !idea) return <IdeaDetailsSkeleton />;

  if (isError || (!canViewIdea && !idea?.isPaid)) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">{!canViewIdea ? "This idea is not yet published" : "Idea not found or access denied"}</p>
          <Button
            onClick={() => router.push(ROUTES.IDEAS)}
            className="btn-glass text-white/70"
          >
            Back to Ideas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">

      {/* Background glow */}
      <div className="fixed top-1/3 right-0 w-100 h-100 bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Back button */}
        <Link
          href={ROUTES.IDEAS}
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Ideas
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header Card */}
            <div className="glass gradient-border rounded-2xl overflow-hidden">

              {/* Hero Image */}
              {idea.images?.[0] && (
                <div className="relative h-72">
                  <Image
                    src={idea.images[0]}
                    alt={idea.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-dark-400/95 via-dark-400/30 to-transparent" />

                  {/* Status */}
                  <div className="absolute top-4 left-4">
                    <IdeaStatusBadge status={idea.status} />
                  </div>

                  {/* Paid badge */}
                  {idea.isPaid && (
                    <div className="absolute top-4 right-4">
                      <span className="badge-amber rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5">
                        <Lock className="w-3 h-3" />
                        Paid — ${idea.price}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Title + Meta */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge-purple rounded-full px-3 py-1 text-xs flex items-center gap-1.5">
                    <Tag className="w-3 h-3" />
                    {idea.category.name}
                  </span>
                  {idea.isPaid && canViewFull && (
                    <span className="badge-green rounded-full px-3 py-1 text-xs flex items-center gap-1.5">
                      <Unlock className="w-3 h-3" />
                      Access Granted
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4">
                  {idea.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-white/40 text-sm">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>{idea.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>{formatDate(idea.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    <span>{idea.viewCount} views</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            {canViewFull ? (
              <>
                {/* Problem Statement */}
                <div className="glass gradient-border rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <span className="text-red-400 text-xs font-bold">!</span>
                    </div>
                    <h2 className="text-white font-semibold">Problem Statement</h2>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {idea.problemStatement}
                  </p>
                </div>

                {/* Proposed Solution */}
                <div className="glass gradient-border rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-400 text-xs font-bold">✓</span>
                    </div>
                    <h2 className="text-white font-semibold">Proposed Solution</h2>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {idea.proposedSolution}
                  </p>
                </div>

                {/* Description */}
                <div className="glass gradient-border rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h2 className="text-white font-semibold">Full Description</h2>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
                    {idea.description}
                  </p>
                </div>

                {/* Additional Images */}
                {idea.images && idea.images.length > 1 && (
                  <div className="glass gradient-border rounded-2xl p-6">
                    <h2 className="text-white font-semibold mb-4">
                      Supporting Images
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      {(idea.images as string[]).slice(1).map((img: string, i: number) => (
                        <div
                          key={i}
                          className="relative aspect-video rounded-xl overflow-hidden"
                        >
                          <Image
                            src={img}
                            alt={`Image ${i + 2}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments */}
                <div className="glass gradient-border rounded-2xl p-6">
                  <CommentSection ideaId={idea.id} />
                </div>
              </>
            ) : (
              /* Paid Banner */
              <PaidIdeaBanner ideaId={idea.id} price={idea.price!} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Vote Card */}
            <div className="glass gradient-border rounded-2xl p-5">
              <p className="text-white/50 text-xs mb-3 uppercase tracking-wider">
                Community Vote
              </p>
              <VoteButtons
                ideaId={idea.id}
                initialUserVote={idea.userVote}
              />
            </div>

            {/* Author Card */}
            <div className="glass gradient-border rounded-2xl p-5">
              <p className="text-white/50 text-xs mb-3 uppercase tracking-wider">
                Author
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {idea.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {idea.author.name}
                  </p>
                  <p className="text-white/30 text-xs">Contributor</p>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="glass gradient-border rounded-2xl p-5 space-y-3">
              <p className="text-white/50 text-xs uppercase tracking-wider">
                Stats
              </p>
              {[
                { label: "Views", value: idea.viewCount, icon: Eye },
                { label: "Comments", value: idea._count?.comments ?? 0, icon: null },
                { label: "Votes", value: idea._count?.votes ?? 0, icon: null },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center">
                  <span className="text-white/40 text-xs">{stat.label}</span>
                  <span className="text-white font-medium text-sm">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Share Card */}
            <div className="glass gradient-border rounded-2xl p-5">
              <p className="text-white/50 text-xs mb-3 uppercase tracking-wider">
                Share
              </p>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast?.success?.("Link copied!");
                }}
                className="w-full btn-glass text-white/60 hover:text-white rounded-xl gap-2 text-sm h-9"
              >
                <Share2 className="w-3.5 h-3.5" />
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────
function IdeaDetailsSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <Skeleton className="h-4 w-24 bg-white/5 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl overflow-hidden">
              <Skeleton className="h-72 w-full bg-white/5" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-5 w-3/4 bg-white/5" />
                <Skeleton className="h-4 w-1/2 bg-white/5" />
              </div>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 space-y-3">
                <Skeleton className="h-4 w-1/3 bg-white/5" />
                <Skeleton className="h-3 w-full bg-white/5" />
                <Skeleton className="h-3 w-5/6 bg-white/5" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5">
                <Skeleton className="h-10 w-full bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}