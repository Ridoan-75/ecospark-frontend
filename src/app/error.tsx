"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-red-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center">
        <div className="w-20 h-20 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-9 h-9 text-red-400" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">Something Went Wrong</h2>
        <p className="text-white/40 text-sm max-w-sm mx-auto mb-2 leading-relaxed">
          An unexpected error occurred. Don&apos;t worry, our team has been notified.
        </p>
        {error?.message && (
          <p className="text-red-400/60 text-xs font-mono mb-8 glass px-4 py-2 rounded-lg inline-block">
            {error.message}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <Button
            onClick={reset}
            className="btn-glow text-white border-0 px-6 rounded-xl gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Link href={ROUTES.HOME}>
            <Button className="btn-glass text-white/70 hover:text-white px-6 rounded-xl gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}