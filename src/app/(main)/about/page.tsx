"use client";

import { Leaf, Users, Globe, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const team = [
  { name: "EcoSpark Team", role: "Core Contributors", initial: "ET" },
];

const values = [
  {
    icon: Leaf,
    title: "Sustainability First",
    description:
      "Every idea on our platform is focused on creating a greener, more sustainable future for everyone.",
    color: "text-green-400",
    bg: "bg-green-500/15",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "We believe the best solutions come from collective intelligence and diverse perspectives.",
    color: "text-purple-400",
    bg: "bg-purple-500/15",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description:
      "Our platform connects eco-conscious thinkers from over 50 countries around the world.",
    color: "text-blue-400",
    bg: "bg-blue-500/15",
  },
  {
    icon: Target,
    title: "Action Oriented",
    description:
      "We don't just share ideas — we help turn them into real, measurable environmental action.",
    color: "text-amber-400",
    bg: "bg-amber-500/15",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-24">

        {/* Hero */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              About Us
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-white mb-6">
            Building a{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Sustainable Future
            </span>{" "}
            Together
          </h1>

          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            EcoSpark Hub is a community-powered platform where sustainability
            enthusiasts share, discover, and vote on ideas to create a better
            future for our planet.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium shadow-lg hover:scale-105 transition">
              Join Community
            </button>
            <button className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Values */}
        <div>
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Our{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Values
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 hover:border-purple-500/30 rounded-2xl p-6 transition-all"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${value.bg} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${value.color}`} />
                  </div>

                  <h3 className="text-white font-semibold text-lg mb-2">
                    {value.title}
                  </h3>

                  <p className="text-white/50 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-white mb-8">
            Our{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Impact
            </span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "2,400+", label: "Ideas Shared" },
              { value: "12,000+", label: "Members" },
              { value: "50+", label: "Countries" },
              { value: "98%", label: "Satisfaction" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="hover:scale-105 transition"
              >
                <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </p>
                <p className="text-white/40 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-10">
            Meet Our{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Team
            </span>
          </h2>

          <div className="flex justify-center">
            {team.map((member) => (
              <div
                key={member.name}
                className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl text-center hover:scale-105 transition"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {member.initial}
                </div>
                <h3 className="text-white font-semibold">
                  {member.name}
                </h3>
                <p className="text-white/50 text-sm">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}