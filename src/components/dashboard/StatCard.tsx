import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type TrendDirection = "up" | "down" | "neutral";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: TrendDirection;
  description?: string;
  accent?: "purple" | "emerald" | "blue" | "amber" | "red";
  isLoading?: boolean;
  className?: string;
}

const accentMap: Record<
  NonNullable<StatCardProps["accent"]>,
  { bg: string; text: string; shadow: string }
> = {
  purple: {
    bg: "from-violet-500 to-purple-700",
    text: "text-violet-400",
    shadow: "shadow-violet-500/20",
  },
  emerald: {
    bg: "from-emerald-400 to-teal-600",
    text: "text-emerald-400",
    shadow: "shadow-emerald-500/20",
  },
  blue: {
    bg: "from-sky-400 to-blue-600",
    text: "text-sky-400",
    shadow: "shadow-sky-500/20",
  },
  amber: {
    bg: "from-amber-400 to-orange-500",
    text: "text-amber-400",
    shadow: "shadow-amber-500/20",
  },
  red: {
    bg: "from-red-400 to-rose-600",
    text: "text-red-400",
    shadow: "shadow-red-500/20",
  },
};

const trendIconMap: Record<TrendDirection, LucideIcon> = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const trendColorMap: Record<TrendDirection, string> = {
  up: "text-emerald-400",
  down: "text-red-400",
  neutral: "text-white/40",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendDirection = "neutral",
  description,
  accent = "purple",
  isLoading = false,
  className,
}: StatCardProps) {
  const colors = accentMap[accent];
  const TrendIcon = trendIconMap[trendDirection];

  if (isLoading) {
    return (
      <div className={cn("glass gradient-border rounded-2xl p-5 flex flex-col gap-4", className)}>
        <div className="flex items-start justify-between">
          <Skeleton className="w-10 h-10 rounded-xl bg-white/5" />
          <Skeleton className="w-14 h-5 rounded-full bg-white/5" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="w-20 h-8 rounded-lg bg-white/5" />
          <Skeleton className="w-28 h-4 rounded bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("glass glass-hover gradient-border rounded-2xl p-5 flex flex-col gap-4 animate-fade-in", className)}>
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "w-10 h-10 rounded-xl bg-linear-to-br flex items-center justify-center shadow-lg",
            colors.bg,
            colors.shadow
          )}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>

        {trend && (
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-white/5",
              trendColorMap[trendDirection]
            )}
          >
            <TrendIcon className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>

      {/* Bottom row */}
      <div>
        <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
        <p className="text-white/60 text-sm mt-0.5 font-medium">{label}</p>
        {description && (
          <p className="text-white/30 text-xs mt-1 leading-relaxed">{description}</p>
        )}
      </div>
    </div>
  );
}