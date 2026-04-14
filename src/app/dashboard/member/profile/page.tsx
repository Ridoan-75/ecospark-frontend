"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { User, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userService } from "@/services/user.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";
import PageHeader from "@/components/shared/PageHeader";

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),
});

type TProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => userService.updateMyProfile(formData),
    onSuccess: (res) => {
      toast.success("Profile updated successfully! ✅");
      updateUser(res.data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME, refetchType: 'active' });
    },
    onError: (err: AxiosError<Record<string, unknown>>) => {
      toast.error((err?.response?.data?.message as string) || "Failed to update profile");
    },
  });

  const onSubmit = (data: TProfileForm) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (imageFile) formData.append("image", imageFile);
    mutate(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <PageHeader
        title="My Profile"
        description="Update your personal information"
        icon={User}
      />

      <div className="glass gradient-border rounded-2xl p-6 md:p-8">

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-2 border-purple-500/30">
              <AvatarImage src={imagePreview || user?.profileImage || ""} />
              <AvatarFallback className="bg-linear-to-br from-purple-600 to-purple-800 text-white text-2xl font-bold">
                {user ? getInitials(user.name) : "?"}
              </AvatarFallback>
            </Avatar>

            {/* Upload overlay */}
            <label className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <p className="text-white/30 text-xs mt-3">
            Click to change profile photo
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Name */}
          <div className="space-y-2">
            <Label className="text-white/70 text-sm font-medium">
              Full Name
            </Label>
            <Input
              {...register("name")}
              className="input-glass h-11 rounded-xl"
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="text-red-400 text-xs">⚠ {errors.name.message}</p>
            )}
          </div>

          {/* Email — readonly */}
          <div className="space-y-2">
            <Label className="text-white/70 text-sm font-medium">
              Email Address
            </Label>
            <Input
              value={user?.email ?? ""}
              disabled
              className="input-glass h-11 rounded-xl opacity-50 cursor-not-allowed"
            />
            <p className="text-white/25 text-xs">
              Email cannot be changed
            </p>
          </div>

          {/* Role — readonly */}
          <div className="space-y-2">
            <Label className="text-white/70 text-sm font-medium">Role</Label>
            <div className="glass rounded-xl h-11 px-4 flex items-center border border-white/10">
              <span
                className={`rounded-full px-2.5 py-1 text-xs ${
                  user?.role === "ADMIN" ? "badge-purple" : "badge-green"
                }`}
              >
                {user?.role}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full btn-glow text-white border-0 h-12 rounded-xl gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}