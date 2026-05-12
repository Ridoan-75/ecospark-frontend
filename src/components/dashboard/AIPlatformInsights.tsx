"use client";

import { useState, useEffect, useRef } from "react";
import { Brain, RefreshCw } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  totalUsers: number;
  activeUsers: number;
  totalIdeas: number;
  underReview: number;
  approved: number;
  totalRevenue: number;
  totalPayments: number;
};

export default function AIPlatformInsights({
  totalUsers,
  activeUsers,
  totalIdeas,
  underReview,
  approved,
  totalRevenue,
  totalPayments,
}: Props) {
  const [insight, setInsight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);

  const generate = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/ai/chat", {
        message: `You are an analytics assistant for EcoSpark, a sustainability idea-sharing community platform. Current platform stats: ${totalUsers} total users (${activeUsers} active), ${totalIdeas} ideas submitted (${underReview} pending review, ${approved} approved), $${totalRevenue.toFixed(2)} total revenue from ${totalPayments} payments. Write a concise 2-3 sentence platform health summary and one specific actionable recommendation for the admin. Be direct and professional. Plain text only, no bullet points, no markdown.`,
      });
      const reply = res.data?.data?.reply || res.data?.data || "";
      const text = typeof reply === "string" ? reply : JSON.stringify(reply);
      setInsight(text);
    } catch {
      setInsight(
        "Unable to generate insights right now. Please ensure the AI service is running and try refreshing."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (totalUsers > 0 && !hasFetched.current) {
      hasFetched.current = true;
      generate();
    }
  }, [totalUsers]);

  return (
    <div className="glass gradient-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg glass-purple flex items-center justify-center shrink-0">
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">AI Platform Insights</h2>
            <p className="text-white/30 text-xs">Powered by AI</p>
          </div>
        </div>
        <button
          onClick={generate}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-purple-400 transition-colors disabled:opacity-40 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="min-h-[60px]">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded bg-white/5" />
            <Skeleton className="h-4 w-5/6 rounded bg-white/5" />
            <Skeleton className="h-4 w-full rounded bg-white/5" />
            <Skeleton className="h-4 w-3/4 rounded bg-white/5" />
          </div>
        ) : insight ? (
          <p className="text-white/60 text-sm leading-relaxed">{insight}</p>
        ) : (
          <p className="text-white/25 text-sm">Loading platform data...</p>
        )}
      </div>

      <p className="text-white/20 text-[10px] text-center mt-3">
        AI analysis based on current platform statistics
      </p>
    </div>
  );
}
