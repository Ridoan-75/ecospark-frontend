"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import { ideaService } from "@/services/idea.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import IdeaForm from "@/components/idea/IdeaForm";
import PageHeader from "@/components/shared/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function EditIdeaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.IDEA(id),
    queryFn: () => ideaService.getById(id),
  });

  const idea = data?.data;

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => ideaService.update(id, formData),
    onSuccess: () => {
      toast.success("Idea updated successfully! ✅");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_IDEAS });
      router.push(ROUTES.MEMBER_IDEAS);
    },
    onError: (err: AxiosError<Record<string, unknown>>) => {
      toast.error((err?.response?.data?.message as string) || "Failed to update idea");
    },
  });

  if (isLoading) return <LoadingSpinner />;

  if (!idea) {
    return (
      <div className="text-center py-16">
        <p className="text-white/50">Idea not found</p>
      </div>
    );
  }

  // শুধু DRAFT বা REJECTED idea edit করা যাবে
  if (idea.status !== "DRAFT" && idea.status !== "REJECTED") {
    router.push(ROUTES.MEMBER_IDEAS);
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <PageHeader
        title="Edit Idea"
        description={`Editing: ${idea.title}`}
        icon={Edit}
      />
      <div className="glass gradient-border rounded-2xl p-6 md:p-8">
        {idea.status === "REJECTED" && idea.rejectionFeedback && (
          <div className="badge-red rounded-xl p-4 mb-6 border border-red-500/25">
            <p className="text-red-400 text-xs font-medium mb-1">
              Rejection Feedback:
            </p>
            <p className="text-red-300 text-sm">{idea.rejectionFeedback}</p>
          </div>
        )}
        <IdeaForm
          defaultValues={idea}
          onSubmit={(formData) => mutate(formData)}
          loading={isPending}
          submitLabel="Update Idea"
        />
      </div>
    </div>
  );
}