import IdeaCard from "./IdeaCard";
import { TIdea } from "@/types/idea.types";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import { Lightbulb } from "lucide-react";

type TProps = {
  ideas: TIdea[];
  isLoading?: boolean;
  showStatus?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
  columns?: 2 | 3 | 4;
};

export default function IdeaGrid({
  ideas,
  isLoading = false,
  showStatus = false,
  emptyTitle = "No ideas found",
  emptyDescription = "No ideas match your current filters.",
  onEmptyAction,
  emptyActionLabel,
  columns = 3,
}: TProps) {
  const gridClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[columns];

  if (isLoading) {
    return (
      <div className={`grid ${gridClass} gap-5`}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl overflow-hidden">
            <Skeleton className="h-44 w-full bg-white/5" />
            <div className="p-4 space-y-2.5">
              <Skeleton className="h-3.5 w-3/4 bg-white/5" />
              <Skeleton className="h-3 w-full bg-white/5" />
              <Skeleton className="h-3 w-2/3 bg-white/5" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-3 w-12 bg-white/5" />
                <Skeleton className="h-3 w-12 bg-white/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <EmptyState
        icon={Lightbulb}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className={`grid ${gridClass} gap-5 animate-fade-in`}>
      {ideas.map((idea) => (
        <IdeaCard key={idea.id} idea={idea} showStatus={showStatus} />
      ))}
    </div>
  );
}