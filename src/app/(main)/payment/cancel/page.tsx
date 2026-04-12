import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <div className="glass gradient-border rounded-3xl p-12">
          <div className="w-24 h-24 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Payment Cancelled</h1>
          <p className="text-white/50 text-sm mb-8 leading-relaxed">
            Your payment was cancelled and you have not been charged. You can try
            again anytime or continue browsing free ideas.
          </p>

          <div className="flex flex-col gap-3">
            <Link href={ROUTES.IDEAS}>
              <Button className="w-full btn-glow text-white border-0 rounded-xl gap-2">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </Link>
            <Link href={ROUTES.HOME}>
              <Button className="w-full btn-glass text-white/70 hover:text-white rounded-xl gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}