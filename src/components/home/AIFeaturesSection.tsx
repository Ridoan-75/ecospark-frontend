"use client";

import { Bot, Sparkles, Search, ThumbsUp, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

const features = [
  {
    icon: Bot,
    title: "AI Chatbot Assistant",
    description:
      "Ask EcoSpark AI anything — get personalized idea suggestions, find trending topics, and explore sustainability insights in real time.",
    color: "purple",
    badge: "Powered by AI",
  },
  {
    icon: Search,
    title: "Smart Search Suggestions",
    description:
      "As you type, AI instantly surfaces matching ideas and categories — so you spend less time searching and more time exploring.",
    color: "blue",
    badge: "Instant Results",
  },
  {
    icon: ThumbsUp,
    title: "Personalized Recommendations",
    description:
      "Based on your votes and activity, the platform learns what you care about and surfaces ideas you'll love automatically.",
    color: "green",
    badge: "For You",
  },
];

const colorMap: Record<string, { bg: string; icon: string; border: string; glow: string }> = {
  purple: {
    bg: "bg-purple-500/15",
    icon: "text-purple-400",
    border: "border-purple-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
  },
  blue: {
    bg: "bg-blue-500/15",
    icon: "text-blue-400",
    border: "border-blue-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
  },
  green: {
    bg: "bg-green-500/15",
    icon: "text-green-400",
    border: "border-green-500/20",
    glow: "group-hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]",
  },
};

export default function AIFeaturesSection() {
  return (
    <section className="py-20 px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-4">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">AI-Powered</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Supercharged by <span className="gradient-text">Artificial Intelligence</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            EcoSpark uses AI to make discovering, sharing, and engaging with sustainability ideas smarter than ever
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            const c = colorMap[feature.color];
            return (
              <div key={feature.title} className={`glass gradient-border rounded-2xl p-7 border ${c.border} ${c.glow} transition-all duration-300 group h-full flex flex-col`}>
                <div className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${c.icon}`} />
                </div>
                <span className={`text-xs font-semibold ${c.icon} mb-3 uppercase tracking-wider`}>
                  {feature.badge}
                </span>
                <h3 className="text-white font-bold text-lg mb-3">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed flex-1">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="glass gradient-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
            <div>
              <p className="text-white font-semibold">Try the AI chatbot right now</p>
              <p className="text-white/40 text-sm">Click the purple button at the bottom-right of the page</p>
            </div>
          </div>
          <Link href={ROUTES.IDEAS}>
            <button className="btn-glow text-white px-6 py-2.5 rounded-xl gap-2 inline-flex items-center text-sm font-medium shrink-0 group border-0">
              Explore Ideas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
