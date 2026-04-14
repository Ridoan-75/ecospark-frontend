"use client";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lightbulb } from "lucide-react";
import { ideaService } from "@/services/idea.service";
import { ROUTES } from "@/constants/routes";
import IdeaForm from "@/components/idea/IdeaForm";
import PageHeader from "@/components/shared/PageHeader";

export default function CreateIdeaPage() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => ideaService.create(formData),
    onSuccess: () => {
      toast.success("Idea created as draft! 🌿", {
        duration: 3000,
      });
      router.push(ROUTES.MEMBER_IDEAS);
    },
    onError: (err: AxiosError<Record<string, unknown>>) => {
      toast.error((err?.response?.data?.message as string) || "Failed to create idea", {
        duration: 5000,
      });
    },
  });

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <PageHeader
        title="Create New Idea"
        description="Share your sustainability idea with the community"
        icon={Lightbulb}
      />
      <div className="glass gradient-border rounded-2xl p-6 md:p-8">
        <IdeaForm
          onSubmit={(formData) => mutate(formData)}
          loading={isPending}
          submitLabel="Save as Draft"
        />
      </div>
    </div>
  );
}