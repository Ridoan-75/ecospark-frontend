"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users, Lightbulb, CreditCard, TrendingUp,
  Clock, CheckCircle2, XCircle, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { userService } from "@/services/user.service";
import { ideaService } from "@/services/idea.service";
import { paymentService } from "@/services/payment.service";
import StatCard from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import IdeaStatusBadge from "@/components/idea/IdeaStatusBadge";
import { TUser } from "@/types/user.types";
import { TIdea } from "@/types/idea.types";

export default function AdminDashboardPage() {

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: () => userService.getAll({ limit: 100 }),
  });

  const { data: ideasData, isLoading: ideasLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_IDEAS,
    queryFn: () => ideaService.getAdminAll({ limit: 100 }),
  });

  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_PAYMENTS,
    queryFn: () => paymentService.getAdminAll({ limit: 100 }),
  });

  const isLoading = usersLoading || ideasLoading || paymentsLoading;

  // ── Users ──────────────────────────────────────────
  const totalUsers = usersData?.meta?.total ?? 0;
  const activeUsers = usersData?.data?.filter((u: TUser) => u.isActive).length ?? 0;

  // ── Ideas ──────────────────────────────────────────
  const ideas = ideasData?.data ?? [];
  const totalIdeas = ideasData?.meta?.total ?? 0;
  const underReview = ideas.filter((i: TIdea) => i.status === "UNDER_REVIEW").length;
  const approved = ideas.filter((i: TIdea) => i.status === "APPROVED").length;
  const recentPending = ideas
    .filter((i: TIdea) => i.status === "UNDER_REVIEW")
    .slice(0, 5);

  // ── Payments ───────────────────────────────────────
  const paymentsResult = paymentsData?.data?.data;
  const totalRevenue = paymentsResult?.stats?.totalRevenue ?? 0;
  const totalPayments = paymentsResult?.stats?.totalSuccessfulPayments ?? 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Admin <span className="gradient-text-purple">Overview</span>
        </h1>
        <p className="text-white/40 text-xs sm:text-sm mt-1">
          Platform statistics and pending actions
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
            title="Total Users"
            value={totalUsers}
            icon={Users}
            color="purple"
            subtitle={`${activeUsers} active`}
          />
          <StatCard
            title="Total Ideas"
            value={totalIdeas}
            icon={Lightbulb}
            color="blue"
            subtitle={`${approved} approved`}
          />
          <StatCard
            title="Pending Review"
            value={underReview}
            icon={Clock}
            color="amber"
            subtitle="Needs attention"
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={TrendingUp}
            color="green"
            subtitle={`${totalPayments} payments`}
          />
        </div>
      )}

      {/* Pending Ideas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-semibold">Pending Review</h2>
            {underReview > 0 && (
              <span className="badge-amber rounded-full px-2 py-0.5 text-xs">
                {underReview}
              </span>
            )}
          </div>
          <Link href={ROUTES.ADMIN_IDEAS}>
            <Button
              variant="ghost"
              className="text-white/40 hover:text-white text-xs gap-1.5 h-8"
            >
              Manage all
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-xl p-4">
                <Skeleton className="h-4 w-1/2 bg-white/5 mb-2" />
                <Skeleton className="h-3 w-1/3 bg-white/5" />
              </div>
            ))}
          </div>
        ) : recentPending.length === 0 ? (
          <div className="glass gradient-border rounded-2xl p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-green-400/50 mx-auto mb-3" />
            <p className="text-white/50 text-sm">
              No ideas pending review — all caught up! ✅
            </p>
          </div>
        ) : (
          <div className="glass gradient-border rounded-2xl overflow-hidden">
            <table className="w-full table-glass">
              <thead>
                <tr>
                  <th className="text-left p-4">Idea</th>
                  <th className="text-left p-4 hidden md:table-cell">Author</th>
                  <th className="text-left p-4 hidden md:table-cell">Category</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentPending.map((idea: TIdea) => (
                  <tr key={idea.id}>
                    <td className="p-4">
                      <p className="text-white text-sm font-medium line-clamp-1">
                        {idea.title}
                      </p>
                      <p className="text-white/30 text-xs mt-0.5">
                        {formatDate(idea.createdAt)}
                      </p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-white/50 text-sm">
                        {idea.author?.name}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="badge-purple rounded-full px-2.5 py-1 text-xs">
                        {idea.category?.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <IdeaStatusBadge status={idea.status} />
                    </td>
                    <td className="p-4">
                      <Link href={ROUTES.ADMIN_IDEAS}>
                        <Button
                          variant="ghost"
                          className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 text-xs h-8 px-3 rounded-lg"
                        >
                          Review →
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "Manage Users", href: ROUTES.ADMIN_USERS, icon: Users },
            { label: "Review Ideas", href: ROUTES.ADMIN_IDEAS, icon: Lightbulb },
            { label: "Categories", href: ROUTES.ADMIN_CATEGORIES, icon: CheckCircle2 },
            { label: "Payments", href: ROUTES.ADMIN_PAYMENTS, icon: CreditCard },
            { label: "Newsletter", href: ROUTES.ADMIN_NEWSLETTER, icon: XCircle },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <div className="glass glass-hover gradient-border rounded-xl p-4 flex items-center gap-3 cursor-pointer">
                  <div className="w-8 h-8 rounded-lg glass-purple flex items-center justify-center">
                    <Icon className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-white/70 text-sm font-medium">
                    {action.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 ml-auto" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}