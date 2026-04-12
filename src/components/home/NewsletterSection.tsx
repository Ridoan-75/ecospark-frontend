"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { newsletterService } from "@/services/newsletter.service";
import { Mail, Sparkles, ArrowRight } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      await newsletterService.subscribe(email);
      toast.success("Subscribed successfully! 🌿");
      setEmail("");
    } catch (error: AxiosError<Record<string, unknown>>) {
      toast.error(
        (error?.response?.data?.message as string) || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-4 relative">
      {/* Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <div className="glass gradient-border rounded-3xl p-10 md:p-14">

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-6 h-6 text-purple-400" />
          </div>

          <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">
              Stay Updated
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our{" "}
            <span className="gradient-text">Newsletter</span>
          </h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            Get the latest sustainability ideas, top voted projects and
            important announcements delivered straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 glass border-white/15 text-white placeholder:text-white/30 focus:border-purple-500/50 bg-transparent rounded-xl h-12"
              required
            />
            <Button
              type="submit"
              disabled={loading}
              className="btn-glow text-white border-0 px-6 rounded-xl h-12 gap-2 whitespace-nowrap"
            >
              {loading ? "Subscribing..." : "Subscribe"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <p className="text-white/30 text-xs mt-4">
            No spam ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}