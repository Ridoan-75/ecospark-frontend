"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { ArrowRight, Play, Sparkles, Zap } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 md:pt-24 pb-8">

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 md:w-175 md:h-175 bg-linear-to-b from-purple-600/30 to-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div className="text-center lg:text-left">

            {/* BADGE */}
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 border border-purple-400/30">
                <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                <span className="text-purple-200 text-sm font-semibold">
                  🌱 Build a Greener Future Together
                </span>
              </div>
            </div>

            {/* HEADING */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6">
              Share Your
              <br />
              <span className=" bg-linear-to-r from-purple-400 via-pink-400 to-purple-400
    bg-clip-text text-transparent
    drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                Sustainable Ideas
              </span>
              <br />
              <span className="text-white">With The World</span>
            </h1>

            {/* TEXT */}
            <p className="text-white/60 text-lg max-w-xl mb-10 mx-auto lg:mx-0">
              Join thousands of eco-conscious innovators building a greener
              future. Share ideas on renewable energy, waste management, and more.
            </p>

            {/* ================= UPGRADED BUTTONS ================= */}
            <motion.div 
              className="flex flex-row gap-4 sm:gap-5 justify-center lg:justify-start max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >

              {/* PRIMARY BUTTON */}
              <motion.div
                className="flex-1 sm:flex-none"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={ROUTES.IDEAS} className="flex-1 sm:flex-none">
                  <Button className="group relative overflow-hidden bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 sm:px-10 py-6 h-14 text-lg font-semibold rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_50px_rgba(147,51,234,0.7)] transition-all duration-300 whitespace-nowrap w-full sm:w-auto">

                    {/* glow animation layer */}
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl" />

                    <Zap className="w-5 h-5 shrink-0" />
                    <span>Explore Ideas</span>
                    <ArrowRight className="w-5 h-5 shrink-0 transform group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </Link>
              </motion.div>

              {/* SECONDARY BUTTON */}
              <motion.div
                className="flex-1 sm:flex-none"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={ROUTES.HOW_IT_WORKS} className="flex-1 sm:flex-none">
                  <Button className="group relative overflow-hidden bg-linear-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/40 hover:to-blue-500/40 border border-cyan-400/40 hover:border-cyan-300/60 text-white px-8 sm:px-10 py-6 h-14 text-lg font-semibold rounded-2xl flex items-center justify-center gap-3 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all duration-300 whitespace-nowrap w-full sm:w-auto">

                    <span className="absolute inset-0 bg-linear-to-r from-cyan-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition duration-500 blur-lg" />

                    <Play className="w-5 h-5 shrink-0 fill-current group-hover:scale-110 transition-transform duration-300" />
                    <span>How It Works</span>

                  </Button>
                </Link>
              </motion.div>

            </motion.div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <div className="absolute -inset-4 bg-purple-600/20 blur-3xl rounded-3xl" />

            <div className="glass gradient-border rounded-3xl overflow-hidden p-4 backdrop-blur-xl">
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="/image.jpg"
                  alt="Sustainability"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}