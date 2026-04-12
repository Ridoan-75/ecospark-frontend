"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (!isAuthenticated) router.push(ROUTES.LOGIN);
  }, [isAuthenticated]);

  const { data, isLoading } = useQuery({
    queryKey: ["payment-verify", sessionId],
    queryFn: () => paymentService.verify(sessionId!),
    enabled: !!sessionId && isAuthenticated,
  });

  const payment = data?.data?.payment;

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