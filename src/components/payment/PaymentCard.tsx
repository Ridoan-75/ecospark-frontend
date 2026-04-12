import { TPayment } from "@/types/payment.types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CreditCard, CheckCircle2, Clock, XCircle, RefreshCw, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const statusConfig = {
  SUCCESS: { icon: CheckCircle2, label: "Paid", className: "badge-green" },
  PENDING: { icon: Clock, label: "Pending", className: "badge-amber" },
  FAILED: { icon: XCircle, label: "Failed", className: "badge-red" },
  REFUNDED: { icon: RefreshCw, label: "Refunded", className: "badge-blue" },
};

type TProps = { payment: TPayment };

export default function PaymentCard({ payment }: TProps) {
  const config = statusConfig[payment.status];
  const Icon = config.icon;

  return (
    <div className="glass gradient-border rounded-xl p-5 flex gap-4 items-start glass-hover">
      <div className="w-10 h-10 rounded-xl glass-purple flex items-center justify-center shrink-0">
        <CreditCard className="w-5 h-5 text-purple-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-white font-medium text-sm truncate">
            {payment.idea?.title ?? "Idea Purchase"}
          </p>
          <span className={cn("rounded-full px-2.5 py-1 text-xs shrink-0 flex items-center gap-1", config.className)}>
            <Icon className="w-3 h-3" />
            {config.label}
          </span>
        </div>
        <p className="text-white/40 text-xs mb-2">{formatDate(payment.createdAt)}</p>
        <div className="flex items-center justify-between">
          <span className="text-green-400 font-semibold text-sm">{formatCurrency(payment.amount)}</span>
          {payment.ideaId && payment.status === "SUCCESS" && (
            <Link href={ROUTES.IDEA_DETAILS(payment.ideaId)}>
              <span className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1 transition-colors">
                View Idea <ExternalLink className="w-3 h-3" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}