"use client";

import Image from "next/image";
import { Calendar, Eye, Tag, User, Sparkles, Lock, Unlock } from "lucide-react";
import { TIdea } from "@/types/idea.types";
import { formatDate } from "@/lib/utils";
import IdeaStatusBadge from "./IdeaStatusBadge";
import VoteButtons from "@/components/vote/VoteButtons";
import CommentSection from "@/components/comment/CommentSection";
import PaidIdeaBanner from "./PaidIdeaBanner";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { paymentService } from "@/services/payment.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type TProps = { idea: TIdea };

export default function IdeaDetails({ idea }: TProps) {
  const { isAuthenticated, user } = useAuth();

  const { data: accessData } = useQuery({
    queryKey: QUERY_KEYS.PAYMENT_ACCESS(idea.id),
    queryFn: () => paymentService.checkAccess(idea.id),
    enabled: isAuthenticated && idea.isPaid,
  });

  const isAuthor = user && idea && user.id === idea.authorId;
  const isAdmin = user?.role === "ADMIN";
  const isApproved = idea.status === "APPROVED";
  const hasAccess = accessData?.data?.hasAccess ?? false;
  
  // Can view page: Authors/Admins always, APPROVED ideas, or paid ideas (to show payment banner)
  const canViewIdea = isAuthor || isAdmin || isApproved || idea.isPaid;
  
  // Can view full content: only if not paid OR user has access
  const canViewFull = canViewIdea && (!idea.isPaid || isAuthor || hasAccess || isAdmin);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="glass gradient-border rounded-2xl overflow-hidden">
          {idea.images?.[0] && (
            <div className="relative h-72">
              <Image src={idea.images[0]} alt={idea.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-dark-400/95 via-dark-400/20 to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                <IdeaStatusBadge status={idea.status} />
                {idea.isPaid && canViewFull && (
                  <span className="badge-green rounded-full px-3 py-1 text-xs flex items-center gap-1.5">
                    <Unlock className="w-3 h-3" /> Access Granted
                  </span>
                )}
                {idea.isPaid && !canViewFull && (
                  <span className="badge-amber rounded-full px-3 py-1 text-xs flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> Premium
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="p-6">
            <span className="badge-purple rounded-full px-3 py-1 text-xs inline-flex items-center gap-1.5 mb-3">
              <Tag className="w-3 h-3" /> {idea.category.name}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4">
              {idea.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-white/40 text-sm">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-purple-400" />{idea.author.name}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-purple-400" />{formatDate(idea.createdAt)}</span>
              <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-purple-400" />{idea.viewCount} views</span>
            </div>
          </div>
        </div>

        {/* Rejection Feedback */}
        {idea.status === "REJECTED" && idea.rejectionFeedback && (
          <div className="glass rounded-xl p-4 border border-red-500/25 bg-red-500/5">
            <p className="text-red-400 text-xs font-semibold mb-1">Rejection Feedback</p>
            <p className="text-white/60 text-sm">{idea.rejectionFeedback}</p>
          </div>
        )}

        {canViewFull ? (
          <>
            <div className="glass gradient-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-400 text-xs font-bold">!</span>
                </div>
                <h2 className="text-white font-semibold">Problem Statement</h2>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{idea.problemStatement}</p>
            </div>

            <div className="glass gradient-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-400 text-xs font-bold">✓</span>
                </div>
                <h2 className="text-white font-semibold">Proposed Solution</h2>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{idea.proposedSolution}</p>
            </div>

            <div className="glass gradient-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h2 className="text-white font-semibold">Full Description</h2>
              </div>
              <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">{idea.description}</p>
            </div>

            {idea.images && idea.images.length > 1 && (
              <div className="glass gradient-border rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-4">Supporting Images</h2>
                <div className="grid grid-cols-2 gap-3">
                  {idea.images.slice(1).map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden">
                      <Image src={img} alt={`Image ${i + 2}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="glass gradient-border rounded-2xl p-6">
              <CommentSection ideaId={idea.id} />
            </div>
          </>
        ) : (
          <PaidIdeaBanner ideaId={idea.id} price={idea.price!} />
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="glass gradient-border rounded-2xl p-5">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Community Vote</p>
          <VoteButtons ideaId={idea.id} initialUserVote={idea.userVote} />
        </div>
        <div className="glass gradient-border rounded-2xl p-5">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Author</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-sm font-bold">
              {idea.author.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium text-sm">{idea.author.name}</p>
              <p className="text-white/30 text-xs">Contributor</p>
            </div>
          </div>
        </div>
        <div className="glass gradient-border rounded-2xl p-5 space-y-3">
          <p className="text-white/40 text-xs uppercase tracking-wider">Stats</p>
          {[
            { label: "Views", value: idea.viewCount },
            { label: "Comments", value: idea._count?.comments ?? 0 },
            { label: "Votes", value: idea._count?.votes ?? 0 },
          ].map((s) => (
            <div key={s.label} className="flex justify-between">
              <span className="text-white/40 text-xs">{s.label}</span>
              <span className="text-white font-medium text-sm">{s.value}</span>
            </div>
          ))}
        </div>
        <div className="glass gradient-border rounded-2xl p-5">
          <Button
            onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!", { duration: 2000 }); }}
            className="w-full btn-glass text-white/60 hover:text-white rounded-xl gap-2 text-sm h-9"
          >
            <Share2 className="w-3.5 h-3.5" /> Copy Link
          </Button>
        </div>
      </div>
    </div>
  );
}