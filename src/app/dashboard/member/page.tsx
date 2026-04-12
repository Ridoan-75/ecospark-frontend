"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { ideaService } from "@/services/idea.service";
import { paymentService } from "@/services/payment.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { StatCard } from "@/components/dashboard/StatCard";
import Link from "next/link";
import {
  Lightbulb,
  CreditCard,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, truncateText } from "@/lib/utils";
import IdeaStatusBadge from "@/components/idea/IdeaStatusBadge";

export default function MemberOverviewPage() {
  const { user } = useAuth();

  const { data: ideasData, isLoading: ideasLoading } = useQuery({
    queryKey: QUERY_KEYS.MY_IDEAS,
    queryFn: () => ideaService.getMyIdeas({ limit: 100 }),
  });

  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: QUERY_KEYS.MY_PAYMENTS,
    queryFn: () => paymentService.getMyPayments(),
  });

  const ideas = ideasData?.data?.data ?? [];
  const payments = paymentsData?.data ?? [];

  const totalIdeas = ideas.length;
  const approvedIdeas = ideas.filter((i) => i.status === "APPROVED").length;
  const pendingIdeas = ideas.filter((i) => i.status === "UNDER_REVIEW").length;
  const totalSpent = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  const recentIdeas = [...ideas]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Welcome Banner */}
      <div className="glass gradient-border rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">
              Welcome back
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Hello, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-white/40 text-sm">
            Here&apos;s what&apos;s happening with your ideas today.
          </p>
        </div>
        <Link href={ROUTES.MEMBER_CREATE_IDEA} className="absolute top-6 right-6">
          <Button className="btn-glow text-white border-0 rounded-xl gap-2 text-sm">
            <Plus className="w-4 h-4" />
            New Idea
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Ideas"
          value={totalIdeas}
          icon={Lightbulb}
          accent="purple"
          isLoading={ideasLoading}
          description="All your submitted ideas"
        />
        <StatCard
          label="Approved"
          value={approvedIdeas}
          icon={CheckCircle2}
          accent="emerald"
          isLoading={ideasLoading}
          description="Live on the platform"
        />
        <StatCard
          label="Under Review"
          value={pendingIdeas}
          icon={Clock}
          accent="amber"
          isLoading={ideasLoading}
          description="Awaiting admin approval"
        />
        <StatCard
          label="Total Spent"
          value={formatCurrency(totalSpent)}
          icon={CreditCard}
          accent="blue"
          isLoading={paymentsLoading}
          description="On paid ideas"
        />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Ideas */}
        <div className="lg:col-span-2 glass gradient-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-purple-400" />
              <h2 className="text-white font-semibold">Recent Ideas</h2>
            </div>
            <Link
              href={ROUTES.MEMBER_IDEAS}
              className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs transition-colors"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {ideasLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 glass rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : recentIdeas.length === 0 ? (
            <div className="text-center py-10">
              <Lightbulb className="w-10 h-10 text-purple-400/30 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No ideas yet</p>
              <Link href={ROUTES.MEMBER_CREATE_IDEA}>
                <Button className="btn-glow text-white border-0 rounded-xl mt-4 text-xs px-4 h-8 gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Create your first idea
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentIdeas.map((idea) => (
                <Link
                  key={idea.id}
                  href={ROUTES.IDEA_DETAILS(idea.id)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg glass-purple flex items-center justify-center shrink-0">
                    <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm font-medium truncate group-hover:text-white transition-colors">
                      {truncateText(idea.title, 45)}
                    </p>
                    <p className="text-white/30 text-xs">
                      {idea.category.name} · {formatDate(idea.createdAt)}
                    </p>
                  </div>
                  <IdeaStatusBadge status={idea.status} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="glass gradient-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <h2 className="text-white font-semibold">Payments</h2>
            </div>
            <Link
              href={ROUTES.MEMBER_PAYMENTS}
              className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-xs transition-colors"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {paymentsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 glass rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : recentPayments.length === 0 ? (
            <div className="text-center py-10">
              <CreditCard className="w-10 h-10 text-blue-400/30 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No payments yet</p>
              <p className="text-white/25 text-xs mt-1">
                Purchase a paid idea to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="glass rounded-xl p-3"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-white/70 text-xs font-medium line-clamp-1 flex-1">
                    {typeof payment.idea === 'object' && payment.idea !== null && 'title' in payment.idea ? String((payment.idea as unknown as Record<string, unknown>).title) : "Idea"}
                    </p>
                    <span
                      className={`text-xs font-semibold shrink-0 ${
                        payment.status === "SUCCESS"
                          ? "text-emerald-400"
                          : payment.status === "PENDING"
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/25 text-[10px]">
                      {formatDate(payment.createdAt)}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        payment.status === "SUCCESS"
                          ? "badge-green"
                          : payment.status === "PENDING"
                          ? "badge-amber"
                          : "badge-red"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}