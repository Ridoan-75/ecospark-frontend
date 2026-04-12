"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ideaService } from "@/services/idea.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import IdeaForm from "@/components/idea/IdeaForm";
import PageHeader from "@/components/shared/PageHeader";
import { Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditIdeaPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.IDEA(id),
    queryFn: () => ideaService.getById(id),
  });

  const idea = data?.data;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-10 w-64 bg-white/5" />
        <div className="glass rounded-2xl p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24 bg-white/5" />
              <Skeleton className="h-12 w-full bg-white/5 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!idea) {
    return <p className="text-white/50 text-center py-16">Idea not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <PageHeader
        icon={Pencil}
        title="Edit Idea"
        description={`Editing: ${idea.title}`}
      />
      <div className="glass gradient-border rounded-2xl p-6">
        <IdeaForm mode="edit" idea={idea} />
      </div>
    </div>
  );
}