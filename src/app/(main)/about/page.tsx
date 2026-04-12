import { Leaf, Users, Globe, Target, Sparkles } from "lucide-react";

const team = [
  { name: "EcoSpark Team", role: "Core Contributors", initial: "ET" },
];

const values = [
  {
    icon: Leaf,
    title: "Sustainability First",
    description: "Every idea on our platform is focused on creating a greener, more sustainable future for everyone.",
    color: "text-green-400",
    bg: "bg-green-500/15",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "We believe the best solutions come from collective intelligence and diverse perspectives.",
    color: "text-purple-400",
    bg: "bg-purple-500/15",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Our platform connects eco-conscious thinkers from over 50 countries around the world.",
    color: "text-blue-400",
    bg: "bg-blue-500/15",
  },
  {
    icon: Target,
    title: "Action Oriented",
    description: "We don't just share ideas — we help turn them into real, measurable environmental action.",
    color: "text-amber-400",
    bg: "bg-amber-500/15",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-20">

        {/* Hero */}
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">About Us</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            We're on a mission to{" "}
            <span className="gradient-text">green the planet</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            EcoSpark Hub is a community-powered platform where sustainability
            enthusiasts share, discover, and vote on ideas to create a better
            future for our planet.
          </p>
        </div>

        {/* Values */}
        <div>
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Our <span className="gradient-text">Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="glass glass-hover gradient-border rounded-2xl p-6"
                >
                  <div className={`w-12 h-12 rounded-xl ${value.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${value.color}`} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {value.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="glass gradient-border rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">
            Our <span className="gradient-text">Impact</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "2,400+", label: "Ideas Shared" },
              { value: "12,000+", label: "Members" },
              { value: "50+", label: "Countries" },
              { value: "98%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold gradient-text-purple mb-1">
                  {stat.value}
                </p>
                <p className="text-white/40 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}