import { cn } from "@/lib/utils";

export default function LoadingSpinner({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-8 h-8 border-4 border-slate-200 border-t-green-600 rounded-full animate-spin",
        className
      )}
    />
  );
}