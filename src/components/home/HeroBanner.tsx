import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { ArrowRight, Play, Sparkles, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24 pb-8">
      {/* Enhanced Background Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-gradient-to-b from-purple-600/30 to-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-gradient-to-r from-purple-800/20 to-purple-800/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-gradient-to-l from-violet-700/15 to-violet-700/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 right-0 w-[400px] h-[400px] bg-gradient-to-l from-purple-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Animated Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badge with Animation */}
        <div className="flex justify-center mb-6 sm:mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 glass-purple rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md border border-purple-400/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
            <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            <span className="text-purple-200 text-xs sm:text-sm font-semibold">
              🌱 AI-Powered Sustainability Community
            </span>
          </div>
        </div>

        {/* Main Heading with Gradient */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-4 sm:mb-6 tracking-tight">
            Share Your
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              Sustainable Ideas
            </span>
            <br />
            <span className="text-white">With The World</span>
          </h1>
        </div>

        {/* Subheading with Better Typography */}
        <p className="text-center text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed animate-fade-in-up">
          Join thousands of eco-conscious innovators building a greener future. Share ideas on renewable energy, waste management, sustainable transport, and beyond.
        </p>

        {/* CTA Buttons with Enhanced Styling */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 animate-fade-in-up">
          <Link href={ROUTES.IDEAS} className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 px-6 sm:px-8 py-5 sm:py-6 text-base font-semibold rounded-xl gap-2 group shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.5)] transition-all duration-300"
            >
              <Zap className="w-4 h-4" />
              Explore Ideas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href={ROUTES.HOW_IT_WORKS} className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto glass hover:glass-hover border-white/20 text-white/90 hover:text-white px-6 sm:px-8 py-5 sm:py-6 text-base font-semibold rounded-xl gap-2 backdrop-blur-md transition-all duration-300"
            >
              <Play className="w-4 h-4 fill-current" />
              How It Works
            </Button>
          </Link>
        </div>

        {/* Stats Grid with Better Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16 animate-fade-in-up">
          {[
            { value: "2,400+", label: "Ideas Shared", icon: Target },
            { value: "12,000+", label: "Community Members", icon: Sparkles },
            { value: "98%", label: "Satisfaction", icon: Zap },
            { value: "50+", label: "Countries", icon: Sparkles },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="glass gradient-border rounded-xl p-4 sm:p-5 text-center hover:glass-hover transition-all duration-300">
                <Icon className="w-4 h-4 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-white/40 text-xs sm:text-sm mt-1.5">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Dashboard Preview Card */}
        <div className="relative animate-fade-in-up">
          {/* Enhanced Glow */}
          <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-purple-600/30 via-purple-600/20 to-transparent rounded-3xl blur-3xl -z-10" />

          <div className="glass gradient-border rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
            {/* Preview Header */}
            <div className="glass-purple px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <div className="glass rounded-lg px-3 py-1 text-white/30 text-xs">
                ecospark.io/ideas
              </div>
            </div>

            {/* Preview Content */}
            <div className="bg-dark-500/50 backdrop-blur-sm p-4 sm:p-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
                {[
                  { label: "Total Ideas", value: "2,451", color: "purple" },
                  { label: "Top Voted", value: "847", color: "green" },
                  { label: "Members", value: "12.4k", color: "blue" },
                ].map((card) => (
                  <div key={card.label} className="glass rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-left hover:glass-hover transition-all">
                    <p className="text-white/40 text-xs mb-1.5">{card.label}</p>
                    <p className="text-white font-bold text-base sm:text-lg">{card.value}</p>
                    <div
                      className={cn(
                        "h-1 rounded-full mt-2 w-8 sm:w-12",
                        card.color === "purple" && "bg-gradient-to-r from-purple-500 to-purple-400",
                        card.color === "green" && "bg-gradient-to-r from-green-500 to-green-400",
                        card.color === "blue" && "bg-gradient-to-r from-blue-500 to-blue-400"
                      )}
                    />
                  </div>
                ))}
              </div>

              {/* Idea Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {[
                  { title: "Solar Panel Grid for Villages", category: "Energy", votes: 234 },
                  { title: "Smart Waste Sorting System", category: "Waste", votes: 189 },
                ].map((idea) => (
                  <div key={idea.title} className="glass rounded-lg sm:rounded-xl p-3 sm:p-4 text-left hover:glass-hover transition-all group cursor-pointer">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="glass-purple text-purple-200 text-xs px-2 py-1 rounded-full font-medium">
                        {idea.category}
                      </span>
                      <span className="text-white/40 text-xs font-semibold">▲ {idea.votes}</span>
                    </div>
                    <p className="text-white/90 text-sm font-semibold leading-snug group-hover:text-purple-300 transition-colors">
                      {idea.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}