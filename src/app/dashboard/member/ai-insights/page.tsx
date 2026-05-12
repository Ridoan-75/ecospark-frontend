"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Lightbulb, RefreshCw, ArrowRight, Send, Brain, Wand2, CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { ideaService } from "@/services/idea.service";
import { Skeleton } from "@/components/ui/skeleton";
import axiosInstance from "@/lib/axios";
import { TIdea } from "@/types/idea.types";

export default function MemberAIInsightsPage() {
  const { data: myIdeasData, isLoading } = useQuery({
    queryKey: QUERY_KEYS.MY_IDEAS,
    queryFn: () => ideaService.getMyIdeas({ limit: 100 }),
  });

  const ideas: TIdea[] = myIdeasData?.data ?? [];
  const total = ideas.length;
  const approved = ideas.filter((i) => i.status === "APPROVED").length;
  const pending = ideas.filter((i) => i.status === "UNDER_REVIEW").length;
  const rejected = ideas.filter((i) => i.status === "REJECTED").length;
  const draft = ideas.filter((i) => i.status === "DRAFT").length;

  // ── Personal Analysis ──────────────────────────────────────────────────────
  const [analysis, setAnalysis] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const hasFetched = useRef(false);

  const generateAnalysis = async () => {
    setAnalysisLoading(true);
    try {
      const res = await axiosInstance.post("/ai/chat", {
        message: `You are a helpful assistant for EcoSpark, a sustainability idea-sharing community. A member's idea stats: ${total} total ideas submitted (${approved} approved, ${pending} pending review, ${rejected} rejected, ${draft} drafts). Write a 3-4 sentence personal performance summary — highlight strengths, explain what the numbers mean, and give one specific tip to improve their approval rate. Be encouraging and practical. Plain text only, no markdown, no bullet points.`,
      });
      const reply = res.data?.data?.reply || res.data?.data || "";
      setAnalysis(typeof reply === "string" ? reply : JSON.stringify(reply));
    } catch {
      setAnalysis("Unable to generate your analysis right now. Please ensure the AI service is running and try refreshing.");
    } finally {
      setAnalysisLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !hasFetched.current) {
      hasFetched.current = true;
      generateAnalysis();
    }
  }, [isLoading]);

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
        message: `You are a helpful assistant for EcoSpark members. Member context: ${total} ideas submitted (${approved} approved, ${pending} pending, ${rejected} rejected). Member question: ${question}. Give a concise, practical answer in 2-4 sentences. Plain text only.`,
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
    "How can I get my idea approved?",
    "What makes a great eco idea?",
    "How to write a better description?",
    "What topics are trending?",
  ];

  // ── AI Idea Suggestions ────────────────────────────────────────────────────
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const generateSuggestions = async () => {
    setSuggestionsLoading(true);
    try {
      const res = await axiosInstance.post("/ai/chat", {
        message: `Generate exactly 5 creative and practical eco-friendly sustainability idea titles for a community idea-sharing platform called EcoSpark. Each title should be unique, inspiring, and action-oriented. Return ONLY a valid JSON array of 5 short titles (max 8 words each). No explanation, no markdown, no extra text. Example format: ["Solar roof community project", "Zero waste school program", "Green corridor planting initiative", "Plastic-free local market campaign", "Rainwater harvest neighbourhood"]`,
      });
      const reply = res.data?.data?.reply || res.data?.data || "";
      const text = typeof reply === "string" ? reply : JSON.stringify(reply);
      const match = text.match(/\[[\s\S]*?\]/);
      if (match) {
        try {
          const parsed = JSON.parse(match[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSuggestions(parsed.slice(0, 5));
            return;
          }
        } catch {}
      }
      const lines = text
        .split("\n")
        .map((l: string) => l.replace(/^[\d.\-*\s]+/, "").trim())
        .filter((l: string) => l.length > 3)
        .slice(0, 5);
      setSuggestions(
        lines.length > 0
          ? lines
          : ["Community solar energy grid", "Urban composting network", "Green transport carpooling", "Plastic-free local market", "Rainwater harvest community"]
      );
    } catch {
      setSuggestions(["Community solar energy grid", "Urban composting network", "Green transport carpooling", "Plastic-free local market", "Rainwater harvest community"]);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  useEffect(() => {
    generateSuggestions();
  }, []);

  // ── AI Writing Helper ──────────────────────────────────────────────────────
  const [topic, setTopic] = useState("");
  const [writingHelp, setWritingHelp] = useState("");
  const [writingLoading, setWritingLoading] = useState(false);

  const getWritingHelp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || writingLoading) return;
    setWritingLoading(true);
    setWritingHelp("");
    try {
      const res = await axiosInstance.post("/ai/chat", {
        message: `You are a helpful writing assistant for EcoSpark, a sustainability idea-sharing platform. A community member wants to submit an idea about: "${topic}". Help them write a compelling idea description in 3-4 sentences. Include what the idea is, why it matters for sustainability, and the potential community impact. Keep it inspiring and practical. Plain text only, no markdown, no bullet points.`,
      });
      const reply = res.data?.data?.reply || res.data?.data || "";
      setWritingHelp(typeof reply === "string" ? reply : JSON.stringify(reply));
    } catch {
      setWritingHelp("AI writing assistant is unavailable right now. Please try again later.");
    } finally {
      setWritingLoading(false);
    }
  };

  const exampleTopics = [
    "Solar energy for schools",
    "Community garden project",
    "EV charging stations",
    "Plastic-free market",
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl glass-purple flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            AI <span className="gradient-text-purple">Insights</span>
          </h1>
        </div>
        <p className="text-white/40 text-xs sm:text-sm mt-1 ml-12">
          Powered by AI — personal analysis and smart idea tools
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
            { label: "Total Ideas", value: total, sub: `${draft} drafts`, icon: Lightbulb, color: "text-purple-400" },
            { label: "Approved", value: approved, sub: "publicly visible", icon: CheckCircle2, color: "text-green-400" },
            { label: "Pending Review", value: pending, sub: "awaiting admin", icon: Clock, color: "text-amber-400" },
            { label: "Rejected", value: rejected, sub: "needs revision", icon: XCircle, color: "text-red-400" },
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

      {/* AI Personal Analysis */}
      <div className="glass gradient-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-purple flex items-center justify-center">
              <Brain className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Personal Performance Analysis</h2>
              <p className="text-white/30 text-xs flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
                Powered by AI
              </p>
            </div>
          </div>
          <button
            onClick={generateAnalysis}
            disabled={analysisLoading || isLoading}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-purple-400 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${analysisLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="bg-white/[0.03] rounded-xl p-4 min-h-[80px] border border-white/5">
          {isLoading || analysisLoading ? (
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-full rounded bg-white/5" />
              <Skeleton className="h-4 w-5/6 rounded bg-white/5" />
              <Skeleton className="h-4 w-full rounded bg-white/5" />
              <Skeleton className="h-4 w-3/4 rounded bg-white/5" />
            </div>
          ) : analysis ? (
            <p className="text-white/70 text-sm leading-relaxed">{analysis}</p>
          ) : (
            <p className="text-white/25 text-sm">Loading your idea data...</p>
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
            <h2 className="text-white font-semibold">Ask AI About Your Ideas</h2>
            <p className="text-white/30 text-xs flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
              Powered by AI
            </p>
          </div>
        </div>

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

        <form onSubmit={askAI} className="flex gap-2 mb-4">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about your ideas or sustainability..."
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

        {answer && (
          <div className="bg-purple-500/8 border border-purple-500/20 rounded-xl p-4">
            <p className="text-white/70 text-sm leading-relaxed">{answer}</p>
          </div>
        )}
      </div>

      {/* AI Idea Suggestions */}
      <div className="glass gradient-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl glass-purple flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Idea Suggestions</h2>
              <p className="text-white/30 text-xs flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
                Powered by AI
              </p>
            </div>
          </div>
          <button
            onClick={generateSuggestions}
            disabled={suggestionsLoading}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-purple-400 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${suggestionsLoading ? "animate-spin" : ""}`} />
            Regenerate
          </button>
        </div>

        <div className="space-y-2">
          {suggestionsLoading
            ? Array.from({ length: 5 }).map((_, i) => (
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

        <p className="text-white/20 text-[10px] text-center mt-4">
          Click any suggestion to start creating that idea
        </p>
      </div>

      {/* AI Writing Helper */}
      <div className="glass gradient-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl glass-purple flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold">AI Writing Helper</h2>
            <p className="text-white/30 text-xs flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
              Powered by AI
            </p>
          </div>
        </div>

        <p className="text-white/40 text-sm mb-4">
          Describe your idea topic and AI will write a compelling description for you.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {exampleTopics.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className="text-xs bg-white/5 hover:bg-purple-500/10 hover:text-purple-300 border border-white/8 hover:border-purple-500/20 text-white/50 rounded-full px-3 py-1.5 transition-all cursor-pointer"
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={getWritingHelp} className="flex gap-2 mb-4">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Community solar panels for apartments..."
            className="flex-1 bg-white/[0.04] border border-white/10 focus:border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!topic.trim() || writingLoading}
            className="w-11 h-11 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 flex items-center justify-center transition-all shrink-0 cursor-pointer"
          >
            {writingLoading ? (
              <RefreshCw className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </form>

        {writingHelp && (
          <div className="bg-purple-500/8 border border-purple-500/20 rounded-xl p-4 space-y-3">
            <p className="text-white/70 text-sm leading-relaxed">{writingHelp}</p>
            <Link
              href={`${ROUTES.MEMBER_CREATE_IDEA}?title=${encodeURIComponent(topic)}`}
              className="inline-flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              Use this to create an idea
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
