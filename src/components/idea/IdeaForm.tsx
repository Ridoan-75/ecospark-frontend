"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Send, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IdeaImageUpload from "./IdeaImageUpload";
import { ideaService } from "@/services/idea.service";
import { categoryService } from "@/services/category.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { ROUTES } from "@/constants/routes";
import { TIdea } from "@/types/idea.types";

const ideaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(150),
  problemStatement: z.string().min(20, "Must be at least 20 characters"),
  proposedSolution: z.string().min(20, "Must be at least 20 characters"),
  description: z.string().min(50, "Must be at least 50 characters"),
  categoryId: z.string().uuid("Please select a category"),
  isPaid: z.boolean(),
  price: z.number().min(1).optional().nullable(),
}).refine((d) => !d.isPaid || (d.price && d.price > 0), {
  message: "Price is required for paid ideas",
  path: ["price"],
});

type TIdeaForm = z.infer<typeof ideaSchema>;

type TProps = {
  idea?: TIdea;
  mode: "create" | "edit";
};

export default function IdeaForm({ idea, mode }: TProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(idea?.images ?? []);

  const { data: categoriesData } = useQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: () => categoryService.getAll({ limit: 100 }),
  });
  const categories = categoriesData?.data?.data ?? [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TIdeaForm>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      title: idea?.title ?? "",
      problemStatement: idea?.problemStatement ?? "",
      proposedSolution: idea?.proposedSolution ?? "",
      description: idea?.description ?? "",
      categoryId: idea?.categoryId ?? "",
      isPaid: idea?.isPaid ?? false,
      price: idea?.price ?? null,
    },
  });

  const isPaid = watch("isPaid");

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) =>
      mode === "create"
        ? ideaService.create(formData)
        : ideaService.update(idea!.id, formData),
    onSuccess: () => {
      toast.success(mode === "create" ? "Idea created as draft!" : "Idea updated!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_IDEAS });
      router.push(ROUTES.MEMBER_IDEAS);
    },
    onError: (err: unknown) => {
      const error = err as {response?: {data?: {message?: string}}};
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    },
  });

  const onSubmit = (data: TIdeaForm) => {
    if (files.length === 0 && existingImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("problemStatement", data.problemStatement);
    formData.append("proposedSolution", data.proposedSolution);
    formData.append("description", data.description);
    formData.append("categoryId", data.categoryId);
    formData.append("isPaid", String(data.isPaid));
    if (data.isPaid && data.price) formData.append("price", String(data.price));
    existingImages.forEach((url) => formData.append("images", url));
    files.forEach((file) => formData.append("images", file));

    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label className="text-white/70 text-sm">Idea Title *</Label>
        <Input
          {...register("title")}
          placeholder="A clear, compelling title for your idea"
          className="input-glass h-12 rounded-xl"
        />
        {errors.title && <p className="text-red-400 text-xs">⚠ {errors.title.message}</p>}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label className="text-white/70 text-sm">Category *</Label>
        <Select
          value={watch("categoryId")}
          onValueChange={(v) => setValue("categoryId", v)}
        >
          <SelectTrigger className="input-glass h-12 rounded-xl">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="bg-dark-200 border-white/10 text-white">
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id} className="hover:bg-white/10 focus:bg-white/10">
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && <p className="text-red-400 text-xs">⚠ {errors.categoryId.message}</p>}
      </div>

      {/* Problem Statement */}
      <div className="space-y-2">
        <Label className="text-white/70 text-sm">Problem Statement *</Label>
        <Textarea
          {...register("problemStatement")}
          placeholder="Describe the environmental problem you're addressing..."
          rows={3}
          className="input-glass rounded-xl resize-none"
        />
        {errors.problemStatement && <p className="text-red-400 text-xs">⚠ {errors.problemStatement.message}</p>}
      </div>

      {/* Proposed Solution */}
      <div className="space-y-2">
        <Label className="text-white/70 text-sm">Proposed Solution *</Label>
        <Textarea
          {...register("proposedSolution")}
          placeholder="Describe your proposed solution..."
          rows={3}
          className="input-glass rounded-xl resize-none"
        />
        {errors.proposedSolution && <p className="text-red-400 text-xs">⚠ {errors.proposedSolution.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label className="text-white/70 text-sm">Full Description *</Label>
        <Textarea
          {...register("description")}
          placeholder="Provide a detailed description — implementation steps, impact, feasibility..."
          rows={6}
          className="input-glass rounded-xl resize-none"
        />
        {errors.description && <p className="text-red-400 text-xs">⚠ {errors.description.message}</p>}
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label className="text-white/70 text-sm">Images * (1–5)</Label>
        <IdeaImageUpload
          files={files}
          onChange={setFiles}
          existingUrls={existingImages}
          onRemoveExisting={(url) => setExistingImages((prev) => prev.filter((u) => u !== url))}
          maxFiles={5}
        />
      </div>

      {/* Paid Toggle */}
      <div className="glass gradient-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <Label className="text-white/80 text-sm font-medium">Premium Idea</Label>
            <p className="text-white/40 text-xs mt-0.5">
              Charge users to access the full details of this idea
            </p>
          </div>
          <Switch
            checked={isPaid}
            onCheckedChange={(v) => {
              setValue("isPaid", v);
              if (!v) setValue("price", null);
            }}
          />
        </div>
        {isPaid && (
          <div className="space-y-2">
            <Label className="text-white/70 text-sm">Price (USD) *</Label>
            <Input
              type="number"
              step="0.01"
              min="1"
              placeholder="e.g. 9.99"
              className="input-glass h-10 rounded-xl"
              {...register("price", {
                valueAsNumber: true,
              })}
            />
            {errors.price && <p className="text-red-400 text-xs">⚠ {errors.price.message}</p>}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          onClick={() => router.back()}
          className="btn-glass text-white/60 hover:text-white rounded-xl px-6"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="btn-glow text-white border-0 rounded-xl px-8 gap-2 flex-1"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : mode === "create" ? (
            <Save className="w-4 h-4" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {isPending
            ? "Saving..."
            : mode === "create"
            ? "Save as Draft"
            : "Update Idea"}
        </Button>
      </div>
    </form>
  );
}