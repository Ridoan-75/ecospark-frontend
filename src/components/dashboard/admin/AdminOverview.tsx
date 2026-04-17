"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Users, Lightbulb, CreditCard, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { ideaService } from "@/services/idea.service";
import { userService } from "@/services/user.service";
import { paymentService } from "@/services/payment.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

export default function AdminOverview() {
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: () => userService.getAll({ limit: 1 }),
  });

  const { data: ideasData, isLoading: ideasLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_IDEAS,
    queryFn: () => ideaService.getAdminAll({ limit: 1 }),
  });

  const { data: reviewIdeasData } = useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_IDEAS, "review"],
    queryFn: () => ideaService.getAdminAll({ status: "UNDER_REVIEW", limit: 1 }),
  });

  const { data: approvedIdeasData } = useQuery({
    queryKey: [...QUERY_KEYS.ADMIN_IDEAS, "approved"],
    queryFn: () => ideaService.getAdminAll({ status: "APPROVED", limit: 1 }),
  });

  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: QUERY_KEYS.ADMIN_PAYMENTS,
    queryFn: () => paymentService.getAdminAll({}),
  });

  // Debug log
  useEffect(() => {
    console.log("Payments Data:", paymentsData);
  }, [paymentsData]);

  const stats = [
    {
      icon: Users,
      label: "Total Members",
      value: usersData?.meta?.total ?? 0,
      color: "text-blue-400",
      bg: "bg-blue-500/15",
      loading: usersLoading,
    },
    {
      icon: Lightbulb,
      label: "Total Ideas",
      value: ideasData?.meta?.total ?? 0,
      color: "text-purple-400",
      bg: "bg-purple-500/15",
      loading: ideasLoading,
    },
    {
      icon: Clock,
      label: "Under Review",
      value: reviewIdeasData?.meta?.total ?? 0,
      color: "text-amber-400",
      bg: "bg-amber-500/15",
      loading: ideasLoading,
    },
    {
      icon: CheckCircle2,
      label: "Approved Ideas",
      value: approvedIdeasData?.meta?.total ?? 0,
      color: "text-green-400",
      bg: "bg-green-500/15",
      loading: ideasLoading,
    },
    {
      icon: CreditCard,
      label: "Total Payments",
      value: paymentsData?.data?.stats?.totalSuccessfulPayments ?? 0,
      color: "text-emerald-400",
      bg: "bg-emerald-500/15",
      loading: paymentsLoading,
    },
    {
      icon: TrendingUp,
      label: "Total Revenue",
      value: formatCurrency(paymentsData?.data?.stats?.totalRevenue ?? 0),
      color: "text-green-400",
      bg: "bg-green-500/15",
      loading: paymentsLoading,
      isString: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="glass gradient-border rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            {stat.loading ? (
              <Skeleton className="h-7 w-16 bg-white/5 mb-1" />
            ) : (
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            )}
            <p className="text-white/40 text-xs">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}