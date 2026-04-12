"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Leaf, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

const loginSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

type TLoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: TLoginForm) => {
    try {
      setLoading(true);
      const res = await authService.login(data);
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name.split(" ")[0]}! 🌿`);

      // Role based redirect
      if (res.data.user.role === "ADMIN") {
        router.push(ROUTES.ADMIN_DASHBOARD);
      } else {
        router.push(ROUTES.MEMBER_DASHBOARD);
      }
    } catch (error: unknown) {
      const err = error as {response?: {data?: {message?: string}}};
      toast.error(
        err?.response?.data?.message || "Invalid email or password"
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
            Welcome back
          </span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Sign in to your{" "}
          <span className="gradient-text">account</span>
        </h1>
        <p className="text-white/40 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.REGISTER}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Sign up free
          </Link>
        </p>
      </div>

      {/* Form Card */}
      <div className="glass gradient-border rounded-2xl p-8">

        {/* Demo Credentials */}
        <div className="mb-6 p-4 rounded-xl bg-purple-500/8 border border-purple-500/20">
          <p className="text-purple-300 text-xs font-medium mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            Demo Credentials
          </p>
          <div className="space-y-1 text-xs text-white/50">
            <p>
              Admin →{" "}
              <span className="text-white/70 font-mono">admin@ecospark.com</span>{" "}
              /{" "}
              <span className="text-white/70 font-mono">admin123456</span>
            </p>
            <p>
              Member →{" "}
              <span className="text-white/70 font-mono">member@ecospark.com</span>{" "}
              /{" "}
              <span className="text-white/70 font-mono">member123456</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

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
                placeholder="Enter your password"
                className="input-glass pl-10 pr-11 h-12 rounded-xl"
                autoComplete="current-password"
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
            {errors.password && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <span>⚠</span> {errors.password.message}
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
                Signing in...
              </div>
            ) : (
              <>
                Sign in
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/20 text-xs">or continue with</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Social placeholder */}
        <div className="grid grid-cols-2 gap-3">
          {["Google", "GitHub"].map((provider) => (
            <button
              key={provider}
              disabled
              className="btn-glass h-11 rounded-xl text-sm text-white/40 cursor-not-allowed opacity-50"
            >
              {provider}
            </button>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-white/25 text-xs mt-6">
        By signing in, you agree to our{" "}
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