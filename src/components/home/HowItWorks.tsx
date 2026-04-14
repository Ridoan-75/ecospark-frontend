"use client";

import { Lightbulb, Send, ThumbsUp, Sparkles, Zap } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

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
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
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
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="glass gradient-border rounded-2xl p-8 text-center relative group glass-hover"
              >
                {/* Step number */}
                <div className="absolute -top-3 left-6 glass-purple rounded-full px-3 py-1">
                  <span className="text-purple-400 text-xs font-bold">
                    {step.step}
                  </span>
                </div>

                {/* Icon */}
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

        {/* Benefits Section */}
        <div className="mt-24 mb-24">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Why Join <span className="gradient-text">EcoSpark?</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Share Your Vision",
                description: "Bring your sustainability ideas to life and inspire others with your innovation."
              },
              {
                title: "Build Community",
                description: "Connect with like-minded individuals passionate about environmental change."
              },
              {
                title: "Gain Recognition",
                description: "Get recognized for your contributions and become a thought leader in your field."
              },
              {
                title: "Earn Income",
                description: "Monetize your ideas through community support and premium features."
              },
              {
                title: "Drive Impact",
                description: "See your ideas implemented and make a real difference in the world."
              },
              {
                title: "Get Feedback",
                description: "Receive valuable insights from community experts to improve your ideas."
              },
            ].map((benefit, index) => (
              <div key={index} className="glass gradient-border rounded-xl p-6 group glass-hover">
                <h4 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-300 transition-colors">
                  {benefit.title}
                </h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h3>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="glass gradient-border rounded-lg divide-y divide-white/10 overflow-hidden">
              {[
                {
                  q: "How long does it take for my idea to be approved?",
                  a: "Our review team typically processes submissions within 2-3 business days. You'll receive email updates about your idea's status."
                },
                {
                  q: "Can I edit my idea after publishing?",
                  a: "Yes, you can edit your idea details, description, and images anytime. Changes are tracked for transparency."
                },
                {
                  q: "How much can I earn from my idea?",
                  a: "Earnings depend on community engagement, premium subscribers, and donations. Top ideas earn hundreds to thousands monthly."
                },
                {
                  q: "Is there a cost to join EcoSpark?",
                  a: "Joining is completely free! Premium features are optional and unlock additional monetization opportunities."
                },
              ].map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="border-0">
                  <AccordionTrigger className="text-white hover:text-purple-300 transition-colors px-6 py-4 [&>svg]:text-purple-400">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}