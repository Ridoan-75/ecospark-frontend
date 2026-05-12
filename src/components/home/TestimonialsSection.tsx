"use client";

import { Quote, Star, Users } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Environmental Engineer",
    avatar: "SC",
    color: "from-purple-600 to-violet-700",
    rating: 5,
    text: "EcoSpark gave my solar panel recycling idea a global audience within days. The community feedback was invaluable — I refined my proposal and it got picked up by a local NGO.",
  },
  {
    name: "James Okafor",
    role: "Urban Planner",
    avatar: "JO",
    color: "from-blue-600 to-indigo-700",
    rating: 5,
    text: "I've used many idea platforms but EcoSpark stands out. The AI chatbot actually helped me discover three similar initiatives I could collaborate on. Incredibly smart platform.",
  },
  {
    name: "Priya Sharma",
    role: "Student Activist",
    avatar: "PS",
    color: "from-green-600 to-teal-700",
    rating: 5,
    text: "As a student with zero budget, sharing my composting initiative here was life-changing. Over 400 upvotes and a community of people who genuinely want to make a difference.",
  },
  {
    name: "Lucas Mendes",
    role: "Renewable Energy Consultant",
    avatar: "LM",
    color: "from-orange-600 to-amber-700",
    rating: 5,
    text: "The quality of ideas here is exceptional. I monetized my wind energy report within a week. The platform makes it easy to share knowledge and get fairly compensated.",
  },
  {
    name: "Aisha Kariuki",
    role: "Community Organizer",
    avatar: "AK",
    color: "from-pink-600 to-rose-700",
    rating: 5,
    text: "EcoSpark is what social media should be — purposeful and impactful. My clean water access proposal connected me with engineers from four different countries.",
  },
  {
    name: "David Park",
    role: "Startup Founder",
    avatar: "DP",
    color: "from-cyan-600 to-blue-700",
    rating: 5,
    text: "We used EcoSpark to validate our biodegradable packaging idea before building a product. The community response saved us months of expensive market research.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-4 relative">
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-blue-600/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-4">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Community Voices</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Loved by <span className="gradient-text">Changemakers</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Thousands of innovators, students, and activists use EcoSpark to turn ideas into impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="glass gradient-border rounded-2xl p-6 h-full flex flex-col">
              <Quote className="w-6 h-6 text-purple-400/40 mb-4 shrink-0" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-white/60 text-sm leading-relaxed flex-1 mb-5">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                <div className={`w-10 h-10 rounded-full bg-linear-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/35 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
