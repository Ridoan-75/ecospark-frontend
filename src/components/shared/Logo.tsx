import Link from "next/link";
import { Leaf } from "lucide-react";
import { ROUTES } from "@/constants/routes";

type TProps = {
  variant?: "compact" | "full";
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
};

export default function Logo({
  variant = "compact",
  showSubtitle = false,
  subtitle,
  className = "",
}: TProps) {
  if (variant === "full") {
    return (
      <Link href={ROUTES.HOME} className={`flex items-center gap-2.5 ${className}`}>
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-600 to-purple-800 flex items-center justify-center glow-purple-sm">
          <Leaf className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-base leading-none">
            Eco<span className="gradient-text-purple">Spark</span>
          </p>
          {showSubtitle && subtitle && (
            <p className="text-white/30 text-[10px] mt-0.5">{subtitle}</p>
          )}
        </div>
      </Link>
    );
  }

  // Compact variant (default)
  return (
    <Link href={ROUTES.HOME} className={`flex items-center gap-2.5 ${className}`}>
      <div className="w-8 h-8 rounded-lg bg-purple-gradient flex items-center justify-center glow-purple-sm">
        <Leaf className="w-4 h-4 text-white" />
      </div>
      <span className="text-white font-bold text-lg tracking-tight">
        Eco<span className="gradient-text-purple">Spark</span>
      </span>
    </Link>
  );
}
