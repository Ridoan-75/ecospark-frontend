import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">

      {/* Background Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-purple-800/15 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-700/10 rounded-full blur-[100px]" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-purple-300 text-sm font-medium">
            EcoSpark AI-Powered Community Platform
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
          Share Your{" "}
          <span className="gradient-text">Sustainability</span>
          <br />
          Ideas With The{" "}
          <span className="gradient-text">World.</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up">
          Join thousands of eco-conscious members sharing impactful ideas on
          energy, waste, transportation and more — to build a greener future
          together.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
          <Link href={ROUTES.IDEAS}>
            <Button
              size="lg"
              className="btn-glow text-white border-0 px-8 py-6 text-base rounded-xl gap-2 group"
            >
              Explore Ideas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href={ROUTES.HOW_IT_WORKS}>
            <Button
              size="lg"
              variant="outline"
              className="glass border-white/15 text-white/80 hover:text-white hover:bg-white/10 px-8 py-6 text-base rounded-xl gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              How It Works
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 animate-fade-in-up">
          {[
            { value: "2,400+", label: "Ideas Shared" },
            { value: "12,000+", label: "Community Members" },
            { value: "98%", label: "Satisfaction Rate" },
            { value: "50+", label: "Countries" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold gradient-text-purple">
                {stat.value}
              </p>
              <p className="text-white/40 text-sm mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 relative animate-fade-in-up">
          {/* Glow under preview */}
          <div className="absolute -inset-4 bg-purple-600/10 rounded-3xl blur-2xl" />

          <div className="relative gradient-border rounded-2xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            {/* Preview Header */}
            <div className="glass-purple px-4 py-3 flex items-center gap-2 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="glass rounded-md px-3 py-1 text-white/30 text-xs">
                  ecospark.io/ideas
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="bg-dark-400/80 p-6">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Total Ideas", value: "2,451", color: "purple" },
                  { label: "Top Voted", value: "847", color: "green" },
                  { label: "Members", value: "12.4k", color: "blue" },
                ].map((card) => (
                  <div key={card.label} className="glass rounded-xl p-3 text-left">
                    <p className="text-white/40 text-xs mb-1">{card.label}</p>
                    <p className="text-white font-bold text-lg">{card.value}</p>
                    <div className={cn(
                      "h-1 w-12 rounded-full mt-2",
                      card.color === "purple" && "bg-purple-500",
                      card.color === "green" && "bg-green-500",
                      card.color === "blue" && "bg-blue-500",
                    )} />
                  </div>
                ))}
              </div>

              {/* Fake idea cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: "Solar Panel Grid for Villages", category: "Energy", votes: 234 },
                  { title: "Smart Waste Sorting System", category: "Waste", votes: 189 },
                ].map((idea) => (
                  <div key={idea.title} className="glass rounded-xl p-3 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="glass-purple text-purple-300 text-xs px-2 py-0.5 rounded-full">
                        {idea.category}
                      </span>
                      <span className="text-white/40 text-xs">▲ {idea.votes}</span>
                    </div>
                    <p className="text-white/80 text-sm font-medium leading-tight">
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

// cn import add করো এই file এ
import { cn } from "@/lib/utils";