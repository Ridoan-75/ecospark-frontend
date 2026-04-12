import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type TPageHeaderProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
};

export default function PageHeader({
  title,
  description,
  icon: Icon,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
}: TPageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl glass-purple flex items-center justify-center">
            <Icon className="w-5 h-5 text-purple-400" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          {description && (
            <p className="text-white/40 text-sm mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="btn-glow text-white border-0 rounded-xl gap-2"
        >
          {ActionIcon && <ActionIcon className="w-4 h-4" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}