"use client";

import { motion } from "framer-motion";
import { Lightbulb, Send, ThumbsUp, Sparkles, Zap, ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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

const faqs = [
  {
    q: "How long does it take for my idea to be approved?",
    a: "Our review team typically processes submissions within 2-3 business days. You'll receive notifications about your idea's status directly in your dashboard.",
  },
  {
    q: "How much can I earn from my idea?",
    a: "Earnings depend on community engagement, premium subscribers, and donations. Top ideas earn hundreds to thousands monthly based on their impact.",
  },
  {
    q: "Is there a cost to join EcoSpark?",
    a: "Joining is completely free! Premium features are optional and unlock additional monetization opportunities for your ideas.",
  },
  {
    q: "Can I edit or update my idea after publishing?",
    a: "You can edit your idea anytime while it's in Draft or Rejected status. Once approved and published, contact support for major changes.",
  },
  {
    q: "Can I delete my idea?",
    a: "Yes, you have full control over your content. You can delete your idea anytime from your dashboard as long as it hasn't been approved yet.",
  },
  {
    q: "How do I increase my idea's visibility?",
    a: "Add quality content with images, engage with comments, share your idea on social media, and stay active in the community to boost visibility.",
  },
  {
    q: "Do I need technical knowledge to post ideas?",
    a: "Not at all! EcoSpark is designed for everyone. Just share your sustainability idea clearly and our community will help refine and improve it.",
  },
  {
    q: "What type of ideas are allowed?",
    a: "We accept all sustainability-related ideas — environmental solutions, eco-friendly products, renewable energy projects, waste reduction strategies, and green innovations.",
  },
  {
    q: "Can I collaborate with other users?",
    a: "Yes! You can connect with other members through comments, discuss ideas, and collaborate to build better sustainability solutions together.",
  },
  {
    q: "How will I know if my idea is successful?",
    a: "Track performance through votes, comments, views, and community engagement metrics directly from your member dashboard in real time.",
  },
];

export default function HowItWorks() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-4 relative">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              Simple Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            From idea to community impact in three simple steps
          </p>
        </motion.div>

        {/* Steps (UNCHANGED ✅) */}
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
                  <span className="text-purple-400 text-xs font-bold">
                    {step.step}
                  </span>
                </div>

                {/* ORIGINAL COLOR LOGIC BACK ✅ */}
                <div
                  className={`
                  w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center
                  ${step.color === "purple" ? "bg-purple-500/20 group-hover:bg-purple-500/30" : ""}
                  ${step.color === "blue" ? "bg-blue-500/20 group-hover:bg-blue-500/30" : ""}
                  ${step.color === "green" ? "bg-green-500/20 group-hover:bg-green-500/30" : ""}
                  ${step.color === "orange" ? "bg-orange-500/20 group-hover:bg-orange-500/30" : ""}
                  transition-colors duration-300
                `}
                >
                  <Icon
                    className={`
                    w-6 h-6
                    ${step.color === "purple" ? "text-purple-400" : ""}
                    ${step.color === "blue" ? "text-blue-400" : ""}
                    ${step.color === "green" ? "text-green-400" : ""}
                    ${step.color === "orange" ? "text-orange-400" : ""}
                  `}
                  />
                </div>

                <h3 className="text-white font-semibold text-lg mb-3">
                  {step.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* FAQ SECTION (REPLACED ✅) */}
        <div className="mt-24 py-24 relative">

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-purple-600/8 rounded-full blur-[100px]" />

          <div className="max-w-3xl mx-auto relative z-10">

            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-4">
                <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">
                  Got questions?
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
              <p className="text-white/40 text-base">
                Everything you need to know about EcoSpark Hub
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={index}
                    className={cn(
                      "glass rounded-2xl overflow-hidden transition-all duration-300 border",
                      isOpen
                        ? "border-purple-500/30 bg-purple-500/5"
                        : "border-white/8 hover:border-purple-500/20"
                    )}
                  >
                    <button
                      onClick={() => toggle(index)}
                      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center",
                            isOpen
                              ? "bg-purple-500/30 text-purple-300"
                              : "bg-white/5 text-white/30 group-hover:bg-purple-500/20 group-hover:text-purple-400"
                          )}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>

                        <span
                          className={cn(
                            "text-base md:text-lg font-medium",
                            isOpen
                              ? "text-purple-300"
                              : "text-white/80 group-hover:text-white"
                          )}
                        >
                          {faq.q}
                        </span>
                      </div>

                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center",
                          isOpen
                            ? "bg-purple-500/30 rotate-180"
                            : "bg-white/5 group-hover:bg-purple-500/20"
                        )}
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-white/30" />
                      </div>
                    </button>

                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300",
                        isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="px-6 pb-5 pl-16">
                        <div className="h-px bg-white/8 mb-4" />
                        <p className="text-white/50 text-sm leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}