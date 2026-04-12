import { Globe, Users, Lightbulb, Heart, Sparkles, ArrowRight, CheckCircle2, Leaf } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

const values = [
  {
    icon: Globe,
    title: "Environmental Impact",
    description:
      "Every idea is evaluated for its potential positive impact on the environment. We prioritize actionable, scalable sustainability solutions.",
    color: "text-green-400",
    bg: "bg-green-500/15",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Our community votes, comments, and shapes which ideas rise to the top. Real people deciding what matters most for our planet.",
    color: "text-blue-400",
    bg: "bg-blue-500/15",
  },
  {
    icon: Lightbulb,
    title: "Open Innovation",
    description:
      "From individuals to organizations, everyone has a seat at the table. The best ideas can come from anywhere.",
    color: "text-amber-400",
    bg: "bg-amber-500/15",
  },
  {
    icon: Heart,
    title: "Transparency",
    description:
      "All submissions go through a fair review process. We're committed to building a trusted space for genuine sustainability discourse.",
    color: "text-red-400",
    bg: "bg-red-500/15",
  },
];

const stats = [
  { value: "2,400+", label: "Ideas Shared" },
  { value: "12,000+", label: "Community Members" },
  { value: "50+", label: "Countries" },
  { value: "98%", label: "Satisfaction Rate" },
];

const milestones = [
  { year: "2022", title: "EcoSpark Founded", desc: "Started as a small community of 50 eco-enthusiasts with a shared vision." },
  { year: "2023", title: "1,000 Ideas Milestone", desc: "Reached our first major milestone with ideas spanning 6 continents." },
  { year: "2024", title: "Payment & Premium Ideas", desc: "Launched premium idea marketplace allowing creators to monetize their innovations." },
  { year: "2025", title: "Global Expansion", desc: "Now serving 12,000+ members across 50+ countries with AI-powered curation." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="relative px-4 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/15 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Our Story</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Building a <span className="gradient-text">Greener Future</span>
            <br />Together
          </h1>
          <p className="text-white/50 text-lg leading-relaxed mb-8">
            EcoSpark Hub was born from a simple belief: that the best sustainability
            solutions come from communities, not corporations. We built a space where
            anyone can share, vote on, and amplify ideas that matter for our planet.
          </p>
          <Link href={ROUTES.REGISTER}>
            <Button className="btn-glow text-white border-0 px-8 py-6 rounded-xl gap-2 text-base group">
              Join the Community
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="glass gradient-border rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-bold gradient-text-purple mb-1">{s.value}</p>
                  <p className="text-white/40 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-4">
                <Leaf className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">Our Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Democratizing <span className="gradient-text">Sustainability</span> Innovation
              </h2>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                We believe the most impactful environmental solutions are already in the minds
                of everyday people. Our platform gives those ideas a voice, a community, and
                the chance to reach decision-makers who can act on them.
              </p>
              <ul className="space-y-2">
                {[
                  "Free idea submission for all members",
                  "Fair admin review process",
                  "Community voting to surface the best ideas",
                  "Premium marketplace for in-depth solutions",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-white/60 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass gradient-border rounded-2xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl glass-purple flex items-center justify-center mb-2">
                <Lightbulb className="w-6 h-6 text-purple-400" />
              </div>
              <blockquote className="text-white/70 text-base leading-relaxed italic">
                "The greatest threat to our planet is the belief that someone else will save it.
                EcoSpark gives every person the tools to be that someone."
              </blockquote>
              <p className="text-purple-400 text-sm font-medium">— EcoSpark Founding Team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Our <span className="gradient-text">Core Values</span>
            </h2>
            <p className="text-white/40 text-base max-w-lg mx-auto">
              Everything we build is guided by these principles
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="glass gradient-border rounded-2xl p-6 flex gap-4 glass-hover">
                  <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${v.color}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{v.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Our <span className="gradient-text">Journey</span>
            </h2>
          </div>
          <div className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-px before:bg-purple-500/20">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-6 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-10 h-10 rounded-full glass-purple border border-purple-500/30 flex items-center justify-center shrink-0 z-10">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                </div>
                <div className="glass gradient-border rounded-xl p-4 flex-1">
                  <span className="text-purple-400 text-xs font-bold mb-1 block">{m.year}</span>
                  <h3 className="text-white font-semibold mb-1">{m.title}</h3>
                  <p className="text-white/50 text-sm">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass gradient-border rounded-3xl p-12">
            <div className="w-14 h-14 rounded-2xl glass-purple flex items-center justify-center mx-auto mb-5">
              <Globe className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Ready to Make an <span className="gradient-text">Impact</span>?
            </h2>
            <p className="text-white/50 text-sm mb-8 max-w-sm mx-auto">
              Join thousands of eco-conscious members sharing ideas that are changing
              how we think about sustainability.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={ROUTES.REGISTER}>
                <Button className="btn-glow text-white border-0 px-8 rounded-xl gap-2">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href={ROUTES.IDEAS}>
                <Button className="btn-glass text-white/70 hover:text-white px-8 rounded-xl">
                  Explore Ideas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}