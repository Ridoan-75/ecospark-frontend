"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Brain, RefreshCw, Send, Sparkles, TrendingUp, Users, Lightbulb, CreditCard } from "lucide-react";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { userService } from "@/services/user.service";
import { ideaService } from "@/services/idea.service";
import { paymentService } from "@/services/payment.service";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/lib/axios";
import { TUser } from "@/types/user.types";
import { TIdea } from "@/types/idea.types";
import { formatCurrency } from "@/lib/utils";

export default function AdminAIInsightsPage() {
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

  const totalUsers = usersData?.meta?.total ?? 0;
  const activeUsers = usersData?.data?.filter((u: TUser) => u.isActive).length ?? 0;
  const ideas = ideasData?.data ?? [];
  const totalIdeas = ideasData?.meta?.total ?? 0;
  const underReview = ideas.filter((i: TIdea) => i.status === "UNDER_REVIEW").length;
  const approved = ideas.filter((i: TIdea) => i.status === "APPROVED").length;
  const rejected = ideas.filter((i: TIdea) => i.status === "REJECTED").length;
  const totalRevenue = paymentsData?.data?.stats?.totalRevenue ?? 0;
  const totalPayments = paymentsData?.data?.stats?.totalSuccessfulPayments ?? 0;

  // ── Platform Insights ──────────────────────────────────────────────────────
  const [insight, setInsight] = useState("");
  const [insightLoading, setInsightLoading] = useState(false);
  const hasFetched = useRef(false);

  const generateInsight = async () => {
    setInsightLoading(true);
    try {
      const res = await axiosInstance.post("/ai/chat", {
        message: `You are an analytics assistant for EcoSpark, a sustainability idea-sharing community platform. Current platform stats: ${totalUsers} total users (${activeUsers} active), ${totalIdeas} ideas submitted (${underReview} pending review, ${approved} approved, ${rejected} rejected), ${formatCurrency(totalRevenue)} total revenue from ${totalPayments} payments. Write a 3-4 sentence platform health summary covering user engagement, idea activity, and revenue performance. End with one specific actionable recommendation for the admin. Be direct and professional. Plain text only, no bullet points, no markdown.`,
      });
      const reply = res.data?.data?.reply || res.data?.data || "";
      setInsight(typeof reply === "string" ? reply : JSON.stringify(reply));
    } catch {
      setInsight("Unable to generate insights right now. Please ensure the AI service is running and try refreshing.");
    } finally {
      setInsightLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && totalUsers > 0 && !hasFetched.current) {
      hasFetched.current = true;
      generateInsight();
    }
  }, [isLoading, totalUsers]);

  // ── Ask AI ─────────────────────────────────────────────────────────────────
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [askLoading, setAskLoading] = useState(false);

  const askAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || askLoading) return;
    setAskLoading(true);
    setAnswer("");
    try {
      const res = await axiosInstance.post("/ai/chat", {
        message: `You are an assistant for EcoSpark admin. Platform context: ${totalUsers} users, ${totalIdeas} ideas, ${underReview} pending review, ${formatCurrency(totalRevenue)} revenue. Admin question: ${question}. Give a concise, helpful answer in 2-4 sentences. Plain text only.`,
      });
      const reply = res.data?.data?.reply || res.data?.data || "";
      setAnswer(typeof reply === "string" ? reply : JSON.stringify(reply));
    } catch {
      setAnswer("AI service is unavailable right now. Please try again later.");
    } finally {
      setAskLoading(false);
    }
  };

  const quickQuestions = [
    "How can I increase user engagement?",
    "What ideas should I approve first?",
    "How is the platform performing?",
    "How to grow the community?",
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl glass-purple flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            AI <span className="gradient-text-purple">Insights</span>
          </h1>
        </div>
        <p className="text-white/40 text-xs sm:text-sm mt-1 ml-12">
          Powered by AI — platform analysis and smart recommendations
        </p>
      </div>

      {/* Stats Summary Row */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Users", value: totalUsers, sub: `${activeUsers} active`, icon: Users, color: "text-purple-400" },
            { label: "Total Ideas", value: totalIdeas, sub: `${approved} approved`, icon: Lightbulb, color: "text-blue-400" },
            { label: "Pending Review", value: underReview, sub: "needs action", icon: TrendingUp, color: "text-amber-400" },
            { label: "Revenue", value: formatCurrency(totalRevenue), sub: `${totalPayments} payments`, icon: CreditCard, color: "text-green-400" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass gradient-border rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl glass-purple flex items-center justify-center shrink-0">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-lg leading-none">{stat.value}</p>
                  <p className="text-white/30 text-xs mt-0.5 truncate">{stat.label}</p>
                  <p className="text-white/20 text-[10px] truncate">{stat.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Platform Analysis */}
      <div className="glass gradient-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-purple flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Platform Health Analysis</h2>
              <p className="text-white/30 text-xs flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
                Powered by AI
              </p>
            </div>
          </div>
          <button
            onClick={generateInsight}
            disabled={insightLoading || isLoading}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-purple-400 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${insightLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="bg-white/[0.03] rounded-xl p-4 min-h-[80px] border border-white/5">
          {isLoading || insightLoading ? (
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-full rounded bg-white/5" />
              <Skeleton className="h-4 w-5/6 rounded bg-white/5" />
              <Skeleton className="h-4 w-full rounded bg-white/5" />
              <Skeleton className="h-4 w-3/4 rounded bg-white/5" />
            </div>
          ) : insight ? (
            <p className="text-white/70 text-sm leading-relaxed">{insight}</p>
          ) : (
            <p className="text-white/25 text-sm">Loading platform data...</p>
          )}
        </div>
      </div>

      {/* Ask AI */}
      <div className="glass gradient-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl glass-purple flex items-center justify-center">
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Ask AI About Your Platform</h2>
            <p className="text-white/30 text-xs flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
              Powered by AI
            </p>
          </div>
        </div>

        {/* Quick questions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => setQuestion(q)}
              className="text-xs bg-white/5 hover:bg-purple-500/10 hover:text-purple-300 border border-white/8 hover:border-purple-500/20 text-white/50 rounded-full px-3 py-1.5 transition-all cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={askAI} className="flex gap-2 mb-4">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about your platform..."
            className="flex-1 bg-white/[0.04] border border-white/10 focus:border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!question.trim() || askLoading}
            className="w-11 h-11 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 flex items-center justify-center transition-all shrink-0 cursor-pointer"
          >
            {askLoading ? (
              <RefreshCw className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </form>

        {/* Answer */}
        {answer && (
          <div className="bg-purple-500/8 border border-purple-500/20 rounded-xl p-4">
            <p className="text-white/70 text-sm leading-relaxed">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
