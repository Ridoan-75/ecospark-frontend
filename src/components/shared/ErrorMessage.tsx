import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export default function ErrorMessage({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className,
}: TProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-red-400" />
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-white/40 text-sm max-w-xs leading-relaxed mb-4">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="btn-glass text-white/60 hover:text-white rounded-xl gap-2 text-sm h-9"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try Again
        </Button>
      )}
    </div>
  );
}