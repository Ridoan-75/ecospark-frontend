"use client";

import { useState, useEffect } from "react";
import { Sparkles, Lightbulb, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { ROUTES } from "@/constants/routes";
import { Skeleton } from "@/components/ui/skeleton";

export default function AIIdeaSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/ai/chat", {
        message: `Generate exactly 3 creative and practical eco-friendly sustainability idea titles for a community idea-sharing platform called EcoSpark. Return ONLY a valid JSON array of 3 short titles (max 8 words each). No explanation, no markdown, no extra text. Example format: ["Solar roof community project", "Zero waste school program", "Green corridor planting initiative"]`,
      });
      const reply = res.data?.data?.reply || res.data?.data || "";
      const text = typeof reply === "string" ? reply : JSON.stringify(reply);

      const match = text.match(/\[[\s\S]*?\]/);
      if (match) {
        try {
          const parsed = JSON.parse(match[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSuggestions(parsed.slice(0, 3));
            return;
          }
        } catch {}
      }

      const lines = text
        .split("\n")
        .map((l: string) => l.replace(/^[\d.\-*\s]+/, "").trim())
        .filter((l: string) => l.length > 3)
        .slice(0, 3);
      setSuggestions(
        lines.length > 0
          ? lines
          : ["Community solar energy grid", "Urban composting network", "Green transport carpooling"]
      );
    } catch {
      setSuggestions(["Community solar energy grid", "Urban composting network", "Green transport carpooling"]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <div className="glass gradient-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg glass-purple flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">AI Idea Suggestions</h2>
            <p className="text-white/30 text-xs">Powered by AI</p>
          </div>
        </div>
        <button
          onClick={generate}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-purple-400 transition-colors disabled:opacity-40 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Regenerate
        </button>
      </div>

      <div className="space-y-2">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl bg-white/5" />
            ))
          : suggestions.map((title, i) => (
              <Link
                key={i}
                href={`${ROUTES.MEMBER_CREATE_IDEA}?title=${encodeURIComponent(title)}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/20 transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <span className="text-white/70 text-sm group-hover:text-white transition-colors flex-1">
                  {title}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-purple-400 transition-colors shrink-0" />
              </Link>
            ))}
      </div>

      <p className="text-white/20 text-[10px] text-center mt-3">
        Click a suggestion to start creating that idea
      </p>
    </div>
  );
}
