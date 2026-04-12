import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type TStatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  color?: "purple" | "green" | "blue" | "amber" | "red";
};

const colorConfig = {
  purple: {
    icon: "text-purple-400",
    bg: "bg-purple-500/15",
    border: "border-purple-500/20",
    trend: "text-purple-400",
  },
  green: {
    icon: "text-green-400",
    bg: "bg-green-500/15",
    border: "border-green-500/20",
    trend: "text-green-400",
  },
  blue: {
    icon: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/20",
    trend: "text-blue-400",
  },
  amber: {
    icon: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/20",
    trend: "text-amber-400",
  },
  red: {
    icon: "text-red-400",
    bg: "bg-red-500/15",
    border: "border-red-500/20",
    trend: "text-red-400",
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "purple",
}: TStatCardProps) {
  const config = colorConfig[color];

  return (
    <div className="glass gradient-border rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center border",
            config.bg,
            config.border
          )}
        >
          <Icon className={cn("w-5 h-5", config.icon)} />
        </div>

        {trend && (
          <div
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-lg",
              trend.positive !== false
                ? "text-green-400 bg-green-500/10"
                : "text-red-400 bg-red-500/10"
            )}
          >
            {trend.positive !== false ? "↑" : "↓"} {trend.value}%
          </div>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
        <p className="text-white/50 text-sm">{title}</p>
        {subtitle && (
          <p className="text-white/25 text-xs mt-1">{subtitle}</p>
        )}
        {trend && (
          <p className="text-white/25 text-xs mt-1">{trend.label}</p>
        )}
      </div>
    </div>
  );
}