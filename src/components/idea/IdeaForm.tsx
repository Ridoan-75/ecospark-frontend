"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { categoryService } from "@/services/category.service";
import { TIdea } from "@/types/idea.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/shared/ImageUpload";
import { Loader2 } from "lucide-react";

const ideaSchema = z
  .object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(150, "Title too long"),
    problemStatement: z
      .string()
      .min(20, "Problem statement must be at least 20 characters"),
    proposedSolution: z
      .string()
      .min(20, "Proposed solution must be at least 20 characters"),
    description: z
      .string()
      .min(50, "Description must be at least 50 characters"),
    categoryId: z.string().min(1, "Please select a category"),
    isPaid: z.boolean().default(false),
    price: z.number().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.isPaid && (!data.price || data.price <= 0)) return false;
      return true;
    },
    { message: "Price is required for paid ideas", path: ["price"] }
  );

type TIdeaForm = z.infer<typeof ideaSchema>;

type TProps = {
  defaultValues?: TIdea;
  onSubmit: (formData: FormData) => void;
  loading: boolean;
  submitLabel?: string;
};

export default function IdeaForm({
  defaultValues,
  onSubmit,
  loading,
  submitLabel = "Save Draft",
}: TProps) {
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    defaultValues?.images ?? []
  );

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
      title: defaultValues?.title ?? "",
      problemStatement: defaultValues?.problemStatement ?? "",
      proposedSolution: defaultValues?.proposedSolution ?? "",
      description: defaultValues?.description ?? "",
      categoryId: defaultValues?.categoryId ?? "",
      isPaid: defaultValues?.isPaid ?? false,
      price: defaultValues?.price ?? null,
    },
  });

  const isPaid = watch("isPaid");

  const handleFormSubmit = (data: TIdeaForm) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("problemStatement", data.problemStatement);
    formData.append("proposedSolution", data.proposedSolution);
    formData.append("description", data.description);
    formData.append("categoryId", data.categoryId);
    formData.append("isPaid", String(data.isPaid));
    if (data.isPaid && data.price) {
      formData.append("price", String(data.price));
    }
    existingImages.forEach((url) => formData.append("images", url));
    newImages.forEach((file) => formData.append("images", file));
    onSubmit(formData);
  };

  const inputClass = "input-glass h-11 rounded-xl";
  const labelClass = "text-white/70 text-sm font-medium";
  const errorClass = "text-red-400 text-xs mt-1 flex items-center gap-1";

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">

      {/* Title */}
      <div className="space-y-2">
        <Label className={labelClass}>Title *</Label>
        <Input
          {...register("title")}
          placeholder="e.g. Solar Panel Grid for Rural Villages"
          className={inputClass}
        />
        {errors.title && (
          <p className={errorClass}>⚠ {errors.title.message}</p>
        )}
      </div>

      {/* Category + isPaid row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className={labelClass}>Category *</Label>
          <Select
            value={watch("categoryId")}
            onValueChange={(v) => setValue("categoryId", v)}
          >
            <SelectTrigger className="input-glass h-11 rounded-xl">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-dark-200 border-white/10 text-white">
              {categories.map((cat) => (
                <SelectItem
                  key={cat.id}
                  value={cat.id}
                  className="hover:bg-white/10 focus:bg-white/10"
                >
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className={errorClass}>⚠ {errors.categoryId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className={labelClass}>Pricing</Label>
          <div className="glass rounded-xl h-11 px-4 flex items-center justify-between border border-white/10">
            <span className="text-white/60 text-sm">
              {isPaid ? "Paid idea" : "Free idea"}
            </span>
            <Switch
              checked={isPaid}
              onCheckedChange={(v) => {
                setValue("isPaid", v);
                if (!v) setValue("price", null);
              }}
            />
          </div>
        </div>
      </div>

      {/* Price — show if isPaid */}
      {isPaid && (
        <div className="space-y-2">
          <Label className={labelClass}>Price (USD) *</Label>
          <Input
            type="number"
            step="0.01"
            min="1"
            placeholder="e.g. 9.99"
            className={inputClass}
            onChange={(e) =>
              setValue("price", parseFloat(e.target.value) || null)
            }
            defaultValue={defaultValues?.price ?? ""}
          />
          {errors.price && (
            <p className={errorClass}>⚠ {errors.price.message}</p>
          )}
        </div>
      )}

      {/* Problem Statement */}
      <div className="space-y-2">
        <Label className={labelClass}>Problem Statement *</Label>
        <Textarea
          {...register("problemStatement")}
          placeholder="Describe the environmental problem this idea addresses..."
          rows={4}
          className="input-glass rounded-xl resize-none"
        />
        {errors.problemStatement && (
          <p className={errorClass}>⚠ {errors.problemStatement.message}</p>
        )}
      </div>

      {/* Proposed Solution */}
      <div className="space-y-2">
        <Label className={labelClass}>Proposed Solution *</Label>
        <Textarea
          {...register("proposedSolution")}
          placeholder="Explain how your idea solves the problem..."
          rows={4}
          className="input-glass rounded-xl resize-none"
        />
        {errors.proposedSolution && (
          <p className={errorClass}>⚠ {errors.proposedSolution.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label className={labelClass}>Full Description *</Label>
        <Textarea
          {...register("description")}
          placeholder="Provide a detailed description of your idea, including implementation steps, expected outcomes, and any relevant data..."
          rows={6}
          className="input-glass rounded-xl resize-none"
        />
        {errors.description && (
          <p className={errorClass}>⚠ {errors.description.message}</p>
        )}
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label className={labelClass}>Images (max 5)</Label>
        <ImageUpload
          value={newImages}
          onChange={setNewImages}
          existingImages={existingImages}
          onRemoveExisting={(url) =>
            setExistingImages((prev) => prev.filter((u) => u !== url))
          }
          maxFiles={5}
        />
        {newImages.length === 0 && existingImages.length === 0 && (
          <p className="text-white/25 text-xs">
            At least 1 image recommended
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full btn-glow text-white border-0 h-12 rounded-xl gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}