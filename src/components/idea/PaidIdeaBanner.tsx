import { Lock, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import PaymentButton from "@/components/payment/PaymentButton";

type TProps = { ideaId: string; price: number };

export default function PaidIdeaBanner({ ideaId, price }: TProps) {
  return (
    <div className="glass gradient-border rounded-2xl p-8 text-center">
      <div className="w-16 h-16 rounded-2xl glass-purple flex items-center justify-center mx-auto mb-4">
        <Lock className="w-7 h-7 text-purple-400" />
      </div>

      <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-2 mb-4">
        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        <span className="text-purple-300 text-sm font-medium">
          Premium Content
        </span>
      </div>

      <h3 className="text-white font-semibold text-xl mb-2">
        This is a Paid Idea
      </h3>
      <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
        Purchase this idea to unlock the full content including the detailed
        problem statement, proposed solution and supporting resources.
      </p>

      <div className="max-w-xs mx-auto">
        <PaymentButton ideaId={ideaId} price={price} />
      </div>

      <p className="text-white/25 text-xs mt-4">
        One-time payment · Instant access · Secure checkout via Stripe
      </p>
    </div>
  );
}