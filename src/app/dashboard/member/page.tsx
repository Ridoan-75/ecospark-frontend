"use client";

import { useQuery } from "@tanstack/react-query";
import { Lightbulb, CheckCircle2, ThumbsUp, CreditCard, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { ideaService } from "@/services/idea.service";
import { useAuth } from "@/hooks/useAuth";
import { TIdea } from "@/types/idea.types";
import StatCard from "@/components/dashboard/StatCard";
import IdeaCard from "@/components/idea/IdeaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import AIIdeaSuggestions from "@/components/dashboard/AIIdeaSuggestions";

export default function MemberDashboardPage() {
  const { user } = useAuth();

  const { data: myIdeasData, isLoading } = useQuery({
    queryKey: QUERY_KEYS.MY_IDEAS,
    queryFn: () => ideaService.getMyIdeas({ limit: 100 }),
  });

  // ── Fix: response structure সঠিকভাবে read করো ──
  const ideas = myIdeasData?.data ?? [];
  const total = ideas.length;
  const approved = ideas.filter((i: TIdea) => i.status === "APPROVED").length;
  const pending = ideas.filter((i: TIdea) => i.status === "UNDER_REVIEW").length;
  const draft = ideas.filter((i: TIdea) => i.status === "DRAFT").length;
  const rejected = ideas.filter((i: TIdea) => i.status === "REJECTED").length;
  const recentIdeas = ideas.slice(0, 3);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      {/* Welcome */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Welcome back,{" "}
          <span className="gradient-text-purple">
            {user?.name.split(" ")[0]}
          </span>{" "}
          👋
        </h1>
        <p className="text-white/40 text-xs sm:text-sm mt-1">
          Here&apos;s an overview of your sustainability ideas
        </p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass rounded-2xl p-4 sm:p-5">
              <Skeleton className="h-10 w-10 rounded-xl bg-white/5 mb-4" />
              <Skeleton className="h-7 w-16 bg-white/5 mb-1" />
              <Skeleton className="h-3 w-24 bg-white/5" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Ideas"
            value={total}
            icon={Lightbulb}
            color="purple"
            subtitle={`${draft} drafts`}
          />
          <StatCard
            title="Approved"
            value={approved}
            icon={CheckCircle2}
            color="green"
            subtitle="Publicly visible"
          />
          <StatCard
            title="Under Review"
            value={pending}
            icon={ThumbsUp}
            color="amber"
            subtitle="Awaiting admin"
          />
          <StatCard
            title="Rejected"
            value={rejected}
            icon={CreditCard}
            color="red"
            subtitle="Need revision"
          />
        </div>
      )}

      {/* AI Idea Suggestions */}
      <AIIdeaSuggestions />

      {/* Recent Ideas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">Recent Ideas</h2>
          <Link href={ROUTES.MEMBER_IDEAS}>
            <Button
              variant="ghost"
              className="text-white/40 hover:text-white text-xs gap-1.5 h-8"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <Skeleton className="h-40 w-full bg-white/5" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-3.5 w-3/4 bg-white/5" />
                  <Skeleton className="h-3 w-full bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : recentIdeas.length === 0 ? (
          <div className="glass gradient-border rounded-2xl p-10 text-center">
            <Lightbulb className="w-10 h-10 text-purple-400/50 mx-auto mb-3" />
            <p className="text-white/50 text-sm mb-4">
              You haven&apos;t created any ideas yet
            </p>
            <Link href={ROUTES.MEMBER_CREATE_IDEA}>
              <Button className="btn-glow text-white border-0 gap-2 rounded-xl">
                <Plus className="w-4 h-4" />
                Create your first idea
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentIdeas.map((idea: TIdea) => (
              <IdeaCard key={idea.id} idea={idea} showStatus />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Create New Idea", href: ROUTES.MEMBER_CREATE_IDEA, icon: Plus, color: "btn-glow" },
            { label: "Browse All Ideas", href: ROUTES.IDEAS, icon: Lightbulb, color: "btn-glass" },
            { label: "My Payments", href: ROUTES.MEMBER_PAYMENTS, icon: CreditCard, color: "btn-glass" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <button className={`w-full ${action.color} text-white rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all`}>
                  <Icon className="w-4 h-4" />
                  {action.label}
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}