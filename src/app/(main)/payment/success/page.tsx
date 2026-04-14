"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { paymentService } from "@/services/payment.service";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [purchasedIdeaId, setPurchasedIdeaId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [redirecting, setRedirecting] = useState(false);

  // Retrieve ideaId from storage on mount
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }
    
    const storedIdeaId = sessionStorage.getItem("purchasedIdeaId") || localStorage.getItem("purchasedIdeaId");
    console.log(`[Payment Success] Retrieved ideaId from storage:`, storedIdeaId);
    setPurchasedIdeaId(storedIdeaId);
  }, [isAuthenticated, router]);

  // Verify payment with Stripe
  const { data, isLoading } = useQuery({
    queryKey: ["payment-verify", sessionId],
    queryFn: () => paymentService.verify(sessionId!),
    enabled: !!sessionId && isAuthenticated,
  });

  const payment = data?.data?.payment;

  // Redirect to idea page
  useEffect(() => {
    // Use ideaId from payment response first, then fall back to stored ideaId
    const ideaIdToUse = payment?.ideaId || purchasedIdeaId;

    if (ideaIdToUse && !redirecting) {
      setRedirecting(true);
      console.log(`[Payment Success] Starting redirect to idea ${ideaIdToUse}`);
      
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // Wait 5 seconds to let user see success message, then redirect
      const redirectTimer = setTimeout(() => {
        console.log(`[Payment Success] Executing redirect to: ${ROUTES.IDEA_DETAILS(ideaIdToUse)}`);
        localStorage.removeItem("purchasedIdeaId");
        sessionStorage.removeItem("purchasedIdeaId");
        router.push(ROUTES.IDEA_DETAILS(ideaIdToUse));
      }, 5000);

      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimer);
      };
    }
  }, [payment?.ideaId, purchasedIdeaId, redirecting, router]);

  // Fallback redirect if no ideaId found after a delay
  useEffect(() => {
    if (!isLoading && !payment?.ideaId && !purchasedIdeaId && !redirecting) {
      console.warn(`[Payment Success] No ideaId found after query completed`);
      console.log(`[Payment Success] payment?.ideaId:`, payment?.ideaId);
      console.log(`[Payment Success] purchasedIdeaId:`, purchasedIdeaId);
      
      const timer = setTimeout(() => {
        console.warn(`[Payment Success] Falling back to home page`);
        router.push(ROUTES.HOME);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, payment?.ideaId, purchasedIdeaId, redirecting, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {isLoading ? (
          <div className="glass gradient-border rounded-3xl p-12">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-white/50">Verifying payment...</p>
          </div>
        ) : (
          <div className="glass gradient-border rounded-3xl p-12 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">
              Payment{" "}
              <span className="gradient-text-green">Successful!</span>
            </h1>
            <p className="text-white/50 mb-6">
              You now have full access to this idea.
            </p>
            {payment?.idea && (
              <div className="glass rounded-xl p-4 mb-6 text-left">
                <p className="text-white/40 text-xs mb-1">Purchased idea</p>
                <p className="text-white text-sm font-medium">
                  {payment.idea.title}
                </p>
              </div>
            )}
            {(payment?.ideaId || purchasedIdeaId) && (
              <p className="text-white/40 text-xs mb-4">
                Redirecting to idea in {countdown}s...
              </p>
            )}
            <div className="flex flex-col gap-3">
              {(payment?.ideaId || purchasedIdeaId) && (
                <Link href={ROUTES.IDEA_DETAILS(payment?.ideaId || purchasedIdeaId!)}>
                  <Button className="w-full btn-glow text-white border-0 rounded-xl gap-2">
                    View Idea Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
              <Link href={ROUTES.MEMBER_PAYMENTS}>
                <Button
                  variant="ghost"
                  className="w-full btn-glass text-white/60 rounded-xl"
                >
                  My Payments
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}