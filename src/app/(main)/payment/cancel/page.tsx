import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="glass gradient-border rounded-3xl p-12 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Payment <span className="text-red-400">Cancelled</span>
          </h1>
          <p className="text-white/50 mb-8">
            Your payment was cancelled. No charges were made.
          </p>
          <div className="flex flex-col gap-3">
            <Link href={ROUTES.IDEAS}>
              <Button className="w-full btn-glow text-white border-0 rounded-xl gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Ideas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}