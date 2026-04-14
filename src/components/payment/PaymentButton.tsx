"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paymentService } from "@/services/payment.service";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/lib/utils";

type TProps = { ideaId: string; price: number };

export default function PaymentButton({ ideaId, price }: TProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to purchase this idea", {
        duration: 4000,
      });
      router.push(ROUTES.LOGIN);
      return;
    }
    try {
      setLoading(true);
      // Store ideaId in both localStorage and sessionStorage for redundancy
      console.log(`[Payment Button] Storing ideaId in storage: ${ideaId}`);
      localStorage.setItem("purchasedIdeaId", ideaId);
      sessionStorage.setItem("purchasedIdeaId", ideaId);
      const res = await paymentService.initiate(ideaId);
      console.log(`[Payment Button] Redirecting to Stripe checkout URL`);
      window.location.href = res.data.checkoutUrl;
    } catch (error: unknown) {
      let errorMessage = "Payment initiation failed";
      if (error instanceof Object && 'response' in error) {
        const response = (error as Record<string, unknown>).response;
        if (response instanceof Object && 'data' in response) {
          const data = (response as Record<string, unknown>).data;
          if (data instanceof Object && 'message' in data) {
            errorMessage = (data as Record<string, string>).message;
          }
        }
      }
      toast.error(errorMessage, {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className="btn-glow text-white border-0 px-8 py-6 rounded-xl text-base gap-2 w-full"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Lock className="w-4 h-4" />
      )}
      {loading ? "Redirecting..." : `Purchase for ${formatCurrency(price)}`}
    </Button>
  );
}