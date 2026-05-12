"use client";

import Link from "next/link";
import { ArrowRight, Lightbulb, Sparkles, Leaf } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export default function CTASection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-75 bg-purple-600/12 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="glass gradient-border rounded-3xl p-10 sm:p-14 text-center overflow-hidden relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-500/15 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-6">
              <Leaf className="w-3.5 h-3.5 text-green-400" />
              <span className="text-purple-300 text-sm font-medium">Join the Movement</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
              Your idea could change{" "}
              <span className="bg-linear-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                the world
              </span>
            </h2>

            <p className="text-white/50 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join thousands of eco-innovators already sharing ideas, voting on solutions, and building a greener future together — for free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link href={ROUTES.MEMBER_CREATE_IDEA}>
                  <button className="group inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-2xl text-base font-semibold shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_50px_rgba(147,51,234,0.6)] transition-all duration-300">
                    <Lightbulb className="w-5 h-5" />
                    Share Your Idea
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              ) : (
                <>
                  <Link href={ROUTES.REGISTER}>
                    <button className="group inline-flex items-center gap-2 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-2xl text-base font-semibold shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_50px_rgba(147,51,234,0.6)] transition-all duration-300">
                      <Sparkles className="w-5 h-5" />
                      Get Started Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link href={ROUTES.IDEAS}>
                    <button className="group inline-flex items-center gap-2 btn-glass text-white/70 hover:text-white px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-300">
                      Browse Ideas
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </>
              )}
            </div>

            <p className="text-white/25 text-sm mt-8">
              Free to join · No credit card required · 12,400+ members
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
