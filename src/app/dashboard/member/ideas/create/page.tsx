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
    <div className="min-h-screen py-8 px-4 md:px-0">
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Header Section */}
        <div className="mb-8">
          <PageHeader
            title="Create New Idea"
            description="Share your sustainability idea with the community"
            icon={Lightbulb}
          />
        </div>

        {/* Form Container with Enhanced Glass Effect */}
        <div className="glass gradient-border rounded-2xl p-6 md:p-10 backdrop-blur-xl shadow-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
          {/* Info Banner */}
          <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <p className="text-white/70 text-sm flex items-start gap-2">
              <span className="text-purple-400 font-bold">💡</span>
              <span>Fill in all fields to save your idea as draft. You can publish it later!</span>
            </p>
          </div>

          <IdeaForm
            onSubmit={(formData) => mutate(formData)}
            loading={isPending}
            submitLabel="Save as Draft"
          />
        </div>
      </div>
    </div>
  );
}