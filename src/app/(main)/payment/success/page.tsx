"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paymentService } from "@/services/payment.service";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/lib/utils";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { data, isLoading } = useQuery({
    queryKey: ["payment-verify", sessionId],
    queryFn: () => paymentService.verify(sessionId!),
    enabled: !!sessionId,
    retry: false,
  });

  const payment = data?.data?.payment;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <div className="glass gradient-border rounded-3xl p-12">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
              <p className="text-white/50 text-sm">Verifying your payment...</p>
            </div>
          ) : (
            <>
              {/* Success Icon */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="w-24 h-24 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center animate-pulse-glow">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-green-500/20 animate-ping" />
              </div>

              <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">Payment Successful</span>
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">
                You're All Set! 🌿
              </h1>
              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                Your payment was processed successfully. You now have full access
                to this premium idea.
              </p>

              {payment && (
                <div className="glass rounded-xl p-4 mb-6 text-left space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 text-xs">Amount Paid</span>
                    <span className="text-green-400 font-semibold text-sm">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 text-xs">Status</span>
                    <span className="badge-green rounded-full px-2 py-0.5 text-xs">
                      {payment.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 text-xs">Gateway</span>
                    <span className="text-white/60 text-xs">{payment.gateway}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                {payment?.ideaId && (
                  <Link href={ROUTES.IDEA_DETAILS(payment.ideaId)}>
                    <Button className="w-full btn-glow text-white border-0 rounded-xl gap-2">
                      View Idea
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
                <Link href={ROUTES.MEMBER_PAYMENTS}>
                  <Button className="w-full btn-glass text-white/70 hover:text-white rounded-xl">
                    View My Payments
                  </Button>
                </Link>
                <Link href={ROUTES.IDEAS}>
                  <Button variant="ghost" className="w-full text-white/40 hover:text-white/70 rounded-xl">
                    Browse More Ideas
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}