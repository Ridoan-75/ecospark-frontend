"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Leaf,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

const registerSchema = z
  .object({
    name: z
      .string({ error: "Name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters"),
    email: z
      .string({ error: "Email is required" })
      .email("Invalid email address"),
    password: z
      .string({ error: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string({
      error: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type TRegisterForm = z.infer<typeof registerSchema>;

const benefits = [
  "Share unlimited sustainability ideas",
  "Vote and comment on community ideas",
  "Access approved eco-friendly projects",
  "Connect with like-minded members",
];

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TRegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  // Password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { strength: 0, label: "", color: "" };
    if (pass.length < 4) return { strength: 1, label: "Weak", color: "bg-red-500" };
    if (pass.length < 6) return { strength: 2, label: "Fair", color: "bg-amber-500" };
    if (pass.length < 10) return { strength: 3, label: "Good", color: "bg-blue-500" };
    return { strength: 4, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: TRegisterForm) => {
    try {
      setLoading(true);
      const res = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome to EcoSpark, ${res.data.user.name.split(" ")[0]}! 🌿`);
      router.push(ROUTES.MEMBER_DASHBOARD);
    } catch (error: unknown) {
      const err = error as {response?: {data?: {message?: string}}};
      toast.error(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">

      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-purple-800 flex items-center justify-center glow-purple-sm">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl">
            Eco<span className="gradient-text-purple">Spark</span>
          </span>
        </Link>

        <div className="inline-flex items-center gap-2 glass-purple rounded-full px-4 py-1.5 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-purple-300 text-xs font-medium">
            Join the community
          </span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Create your{" "}
          <span className="gradient-text">free account</span>
        </h1>
        <p className="text-white/40 text-sm">
          Already have an account?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Benefits */}
      <div className="glass-purple rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
              <span className="text-white/60 text-xs">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="glass gradient-border rounded-2xl p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Name */}
          <div className="space-y-2">
            <Label className="text-white/70 text-sm font-medium">
              Full name
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                {...register("name")}
                type="text"
                placeholder="John Doe"
                className="input-glass pl-10 h-12 rounded-xl"
                autoComplete="name"
              />
            </div>
            {errors.name && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <span>⚠</span> {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-white/70 text-sm font-medium">
              Email address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="input-glass pl-10 h-12 rounded-xl"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <span>⚠</span> {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="text-white/70 text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                className="input-glass pl-10 pr-11 h-12 rounded-xl"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye className="w-4 h-4" />
                }
              </button>
            </div>

            {/* Password Strength */}
            {password && (
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        level <= passwordStrength.strength
                          ? passwordStrength.color
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-white/40">
                  Strength:{" "}
                  <span className={`font-medium ${
                    passwordStrength.color
                      .replace("bg-", "text-")
                  }`}>
                    {passwordStrength.label}
                  </span>
                </p>
              </div>
            )}

            {errors.password && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <span>⚠</span> {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label className="text-white/70 text-sm font-medium">
              Confirm password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                className="input-glass pl-10 pr-11 h-12 rounded-xl"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showConfirm
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye className="w-4 h-4" />
                }
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <span>⚠</span> {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full btn-glow text-white border-0 h-12 rounded-xl text-sm font-medium gap-2 group mt-2"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </div>
            ) : (
              <>
                Create free account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Footer note */}
      <p className="text-center text-white/25 text-xs mt-6">
        By registering, you agree to our{" "}
        <span className="text-purple-400/70 hover:text-purple-400 cursor-pointer">
          Terms of Service
        </span>{" "}
        and{" "}
        <span className="text-purple-400/70 hover:text-purple-400 cursor-pointer">
          Privacy Policy
        </span>
      </p>
    </div>
  );
}