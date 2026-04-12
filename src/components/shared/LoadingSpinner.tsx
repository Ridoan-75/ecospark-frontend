import { cn } from "@/lib/utils";

export default function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <div className="w-10 h-10 border-3 border-white/10 border-t-purple-500 rounded-full animate-spin" />
    </div>
  );
}