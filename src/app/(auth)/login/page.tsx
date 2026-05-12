"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, Zap } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import Logo from "@/components/shared/Logo";

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

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSuccess = async (accessToken: string) => {
    try {
      setGoogleLoading(true);
      const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }).then((r) => r.json());

      const res = await authService.googleLogin({
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
      });
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome, ${res.data.user.name.split(" ")[0]}! 🌿`, { duration: 3000 });

      if (res.data.user.role === "ADMIN") {
        router.push(ROUTES.ADMIN_DASHBOARD);
      } else {
        router.push(ROUTES.MEMBER_DASHBOARD);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      const msg = err?.response?.data?.message || "Google sign-in failed. Please try again.";
      console.error("Google login error:", error);
      toast.error(msg, { duration: 4000 });
    } finally {
      setGoogleLoading(false);
    }
  };

  const signInWithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogleSuccess(tokenResponse.access_token),
    onError: () => toast.error("Google sign-in failed. Please try again.", { duration: 4000 }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const fillDemo = (role: "admin" | "member") => {
    const credentials = {
      admin: { email: "admin@ecospark.com", password: "admin123456" },
      member: { email: "member@ecospark.com", password: "member123456" },
    };
    setValue("email", credentials[role].email, { shouldValidate: true });
    setValue("password", credentials[role].password, { shouldValidate: true });
  };

  const onSubmit = async (data: TLoginForm) => {
    try {
      setLoading(true);
      const res = await authService.login(data);
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name.split(" ")[0]}! 🌿`, {
        duration: 3000,
      });

      // Role based redirect
      if (res.data.user.role === "ADMIN") {
        router.push(ROUTES.ADMIN_DASHBOARD);
      } else {
        router.push(ROUTES.MEMBER_DASHBOARD);
      }
    } catch (error: unknown) {
      const err = error as {response?: {data?: {message?: string}}};
      toast.error(
        err?.response?.data?.message || "Invalid email or password",
        {
          duration: 5000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">

      {/* Logo */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <Logo variant="compact" />
        </div>

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
        <div className="mb-6 rounded-xl border border-purple-500/20 overflow-hidden">
          <div className="px-4 py-2.5 bg-purple-500/10 flex items-center gap-2 border-b border-purple-500/15">
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-purple-300 text-xs font-semibold">Quick Demo Login</span>
            <span className="text-white/80 text-[10px] text-bold ml-auto">Click to auto-fill</span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-white/8">
            <button
              type="button"
              onClick={() => fillDemo("admin")}
              className="flex flex-col gap-1.5 px-4 py-3 bg-white/3 hover:bg-purple-500/12 active:bg-purple-500/20 transition-all text-left group"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="text-purple-300 text-xs font-semibold group-hover:text-purple-200 transition-colors">Admin</span>
              </div>
              <span className="text-white/60 text-[11px] font-mono leading-none">admin@ecospark.com</span>
              <span className="text-white/35 text-[11px] font-mono leading-none">admin123456</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo("member")}
              className="flex flex-col gap-1.5 px-4 py-3 bg-white/3 hover:bg-purple-500/12 active:bg-purple-500/20 transition-all text-left group"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <span className="text-violet-300 text-xs font-semibold group-hover:text-violet-200 transition-colors">Member</span>
              </div>
              <span className="text-white/60 text-[11px] font-mono leading-none">member@ecospark.com</span>
              <span className="text-white/35 text-[11px] font-mono leading-none">member123456</span>
            </button>
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
          <div>
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
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/20 text-xs">or continue with</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google login */}
        <button
          type="button"
          onClick={() => signInWithGoogle()}
          disabled={googleLoading}
          className="w-full h-12 rounded-xl flex items-center justify-center gap-3 border border-white/10 hover:border-purple-500/30 bg-white/5 hover:bg-white/8 backdrop-blur-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {googleLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          <span className="text-white/60 group-hover:text-white text-sm font-medium transition-colors">
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </span>
        </button>
      </div>

      {/* Footer note */}
      <p className="text-center text-white/25 text-xs mt-6">
        By signing in, you agree to our{" "}
        <Link
          href={`${ROUTES.TERMS}?from=login`}
          className="text-purple-400/70 hover:text-purple-400 transition-colors"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href={`${ROUTES.PRIVACY}?from=login`}
          className="text-purple-400/70 hover:text-purple-400 transition-colors"
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}