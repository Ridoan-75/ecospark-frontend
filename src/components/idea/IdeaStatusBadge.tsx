import { cn } from "@/lib/utils";
import { TIdeaStatus } from "@/types/common.types";
import { Clock, CheckCircle2, XCircle, FileEdit } from "lucide-react";

type TProps = {
  status: TIdeaStatus;
  className?: string;
};

const config: Record<
  TIdeaStatus,
  {
    label: string;
    className: string;
    icon: React.ElementType;
  }
> = {
  DRAFT: {
    label: "Draft",
    className: "badge-blue",
    icon: FileEdit,
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "badge-amber",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    className: "badge-green",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    className: "badge-red",
    icon: XCircle,
  },
};

export default function IdeaStatusBadge({
  status,
  className,
}: TProps) {
  const { label, className: badgeClass, icon: Icon } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        badgeClass,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}