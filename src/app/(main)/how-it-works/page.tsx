"use client";

import { motion } from "framer-motion";
import HowItWorks from "@/components/home/HowItWorks";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

        </motion.div>

        {/* Full How It Works Section */}
        <HowItWorks />
      </div>
    </div>
  );
}
