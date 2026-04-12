"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserCircle, Camera, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
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
  const { user, updateUser } = useAuthStore();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<TProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: FormData) => userService.updateMyProfile(formData),
    onSuccess: (res) => {
      updateUser(res.data);
      toast.success("Profile updated successfully!");
      setImageFile(null);
      setImagePreview(null);
    },
    onError: (err: unknown) => {
      let errorMessage = "Update failed";
      if (err instanceof Object && 'response' in err) {
        const response = (err as Record<string, unknown>).response;
        if (response instanceof Object && 'data' in response) {
          const data = (response as Record<string, unknown>).data;
          if (data instanceof Object && 'message' in data) {
            errorMessage = (data as Record<string, string>).message;
          }
        }
      }
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: TProfileForm) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (imageFile) {
      formData.append("image", imageFile);
    }
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
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <PageHeader
        title="My Profile"
        description="Update your personal information and avatar"
        icon={UserCircle}
      />

      <div className="glass gradient-border rounded-2xl p-8">

        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={imagePreview ?? user?.profileImage ?? ""} />
              <AvatarFallback className="bg-linear-to-br from-violet-500 to-purple-700 text-white text-xl font-bold">
                {user?.name ? getInitials(user.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-1 -right-1 w-7 h-7 btn-glow rounded-full flex items-center justify-center cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{user?.name}</p>
            <p className="text-white/40 text-sm">{user?.email}</p>
            <span className="badge-purple rounded-full px-2.5 py-1 text-xs mt-1.5 inline-block capitalize">
              {user?.role?.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-white/70 text-sm font-medium">
              Full Name
            </Label>
            <Input
              {...register("name")}
              className="input-glass h-12 rounded-xl"
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="text-red-400 text-xs">⚠ {errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white/70 text-sm font-medium">
              Email Address
            </Label>
            <Input
              value={user?.email ?? ""}
              disabled
              className="input-glass h-12 rounded-xl opacity-50 cursor-not-allowed"
            />
            <p className="text-white/25 text-xs">
              Email cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-white/70 text-sm font-medium">
              Role
            </Label>
            <Input
              value={user?.role ?? ""}
              disabled
              className="input-glass h-12 rounded-xl opacity-50 cursor-not-allowed capitalize"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending || (!isDirty && !imageFile)}
              className="btn-glow text-white border-0 h-11 px-8 rounded-xl gap-2"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}