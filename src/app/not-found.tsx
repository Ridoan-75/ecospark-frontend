import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf, Home, ArrowLeft } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center">
        <div className="w-20 h-20 rounded-2xl glass-purple flex items-center justify-center mx-auto mb-6">
          <Leaf className="w-9 h-9 text-purple-400" />
        </div>

        <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-3">Page Not Found</h2>
        <p className="text-white/40 text-base max-w-sm mx-auto mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved to a
          greener pasture.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href={ROUTES.HOME}>
            <Button className="btn-glow text-white border-0 px-6 rounded-xl gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Link href={ROUTES.IDEAS}>
            <Button className="btn-glass text-white/70 hover:text-white px-6 rounded-xl gap-2">
              <ArrowLeft className="w-4 h-4" />
              Browse Ideas
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}