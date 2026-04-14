"use client";

import HowItWorks from "@/components/home/HowItWorks";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How It Works
          </h1>
          <p className="text-white/60 text-lg">
            Learn how EcoSpark helps you share and monetize your innovative ideas
          </p>
        </div>

        {/* Full How It Works Section */}
        <HowItWorks />
      </div>
    </div>
  );
}
