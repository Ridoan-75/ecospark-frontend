"use client";

import { Lightbulb, Send, ThumbsUp, Sparkles, Zap } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    step: "01",
    title: "Create Your Idea",
    description:
      "Sign up and share your sustainability idea with a title, problem statement, proposed solution and supporting images.",
    color: "purple",
  },
  {
    icon: Send,
    step: "02",
    title: "Submit for Review",
    description:
      "Submit your idea for admin review. Our team will evaluate and approve ideas that meet community standards.",
    color: "blue",
  },
  {
    icon: ThumbsUp,
    step: "03",
    title: "Get Voted",
    description:
      "Once approved, the community can upvote, comment and engage with your idea — making it go viral!",
    color: "green",
  },
  {
    icon: Zap,
    step: "04",
    title: "Earn & Monetize",
    description:
      "Unlock premium features for your top ideas, receive donations from supporters, and earn revenue as your ideas gain traction.",
    color: "orange",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            From idea to community impact in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="glass gradient-border rounded-2xl p-8 text-center relative group glass-hover"
              >
                <div className="absolute -top-3 left-6 glass-purple rounded-full px-3 py-1">
                  <span className="text-purple-400 text-xs font-bold">{step.step}</span>
                </div>

                <div className={`
                  w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center
                  ${step.color === "purple" ? "bg-purple-500/20 group-hover:bg-purple-500/30" : ""}
                  ${step.color === "blue" ? "bg-blue-500/20 group-hover:bg-blue-500/30" : ""}
                  ${step.color === "green" ? "bg-green-500/20 group-hover:bg-green-500/30" : ""}
                  ${step.color === "orange" ? "bg-orange-500/20 group-hover:bg-orange-500/30" : ""}
                  transition-colors duration-300
                `}>
                  <Icon className={`
                    w-6 h-6
                    ${step.color === "purple" ? "text-purple-400" : ""}
                    ${step.color === "blue" ? "text-blue-400" : ""}
                    ${step.color === "green" ? "text-green-400" : ""}
                    ${step.color === "orange" ? "text-orange-400" : ""}
                  `} />
                </div>

                <h3 className="text-white font-semibold text-lg mb-3">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
