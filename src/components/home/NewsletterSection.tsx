"use client";
import { useState } from "react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { newsletterService } from "@/services/newsletter.service";
import {
  Mail,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  Users,
  Leaf,
  Globe,
  Lightbulb,
} from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      await newsletterService.subscribe(email);
      toast.success("Subscribed successfully! 🌿", { duration: 3000 });
      setEmail("");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(
          (error?.response?.data?.message as string) ||
            "Something went wrong",
          { duration: 5000 }
        );
      } else {
        toast.error("Something went wrong", { duration: 5000 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-20 px-4 md:px-8 lg:px-16 overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 bg-purple-600/10 blur-[140px] rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* GLASS BOX */}
        <div className="glass gradient-border rounded-3xl p-10 md:p-14 lg:p-16">

          {/* TOP */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 glass-purple rounded-full px-5 py-2 border border-purple-400/20 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">
                Stay Updated
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Join Our{" "}
              <span className="gradient-text">Newsletter</span>
            </h2>

            <p className="text-white/50 text-lg">
              Get exclusive updates, sustainability ideas, and top voted
              projects directly to your inbox.
            </p>
          </div>

          {/* GRID */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT */}
            <div className="space-y-8 text-center lg:text-left">

              {/* ICON GROUP */}
              <div className="flex items-center justify-center lg:justify-start gap-4">

                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-400/20 flex items-center justify-center">
                  <Mail className="w-7 h-7 text-purple-400" />
                </div>

                <div className="flex gap-3">

                  <div className="w-16 h-16 rounded-xl bg-green-500/10 border border-green-400/20 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-green-400" />
                  </div>

                  <div className="w-16 h-16 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-400" />
                  </div>

                  <div className="w-16 h-16 rounded-xl bg-yellow-500/10 border border-yellow-400/20 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                  </div>

                </div>
              </div>

              <p className="text-white/60 leading-relaxed text-lg">
                Stay ahead with curated content designed to help you discover
                impactful ideas and stay connected with the community.
              </p>

              {/* STATS */}
              <div className="flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-white/60 text-sm">
                    2,400+ subscribers
                  </span>
                </div>

                <div className="w-px h-4 bg-white/10" />

                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-white/60 text-sm">
                    Weekly updates
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-5">

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {[
                  "Top voted projects",
                  "Sustainability tips",
                  "Early announcements",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-purple-300/70 bg-purple-500/10 border border-purple-400/15 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass border-white/15 text-white placeholder:text-white/30 focus:border-purple-500/50 bg-transparent rounded-xl h-14 px-5 cursor-pointer"
                required
              />

              <div>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="group relative overflow-hidden w-full bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 transition-all duration-300 font-semibold h-16 px-8 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(147,51,234,0.4)] hover:shadow-[0_0_50px_rgba(147,51,234,0.7)] text-lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Subscribing...
                    </span>
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <Shield className="w-3.5 h-3.5 text-white/30" />
                <p className="text-white/30 text-xs">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}