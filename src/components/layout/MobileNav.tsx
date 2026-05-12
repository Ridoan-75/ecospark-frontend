"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  User,
  Home,
  Lightbulb,
  Info,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/shared/Logo";

const navLinks = [
  { label: "Home", href: ROUTES.HOME, icon: Home },
  { label: "Ideas", href: ROUTES.IDEAS, icon: Lightbulb },
  { label: "How It Works", href: ROUTES.HOW_IT_WORKS, icon: BookOpen },
  { label: "About", href: ROUTES.ABOUT, icon: Info },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();

  const dashboardRoute = isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.MEMBER_DASHBOARD;

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push(ROUTES.HOME);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/8 transition-all cursor-pointer">
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-80 sidebar-glass border-l border-white/10 text-white p-0"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="px-5 h-[72px] border-b border-white/8 flex items-center">
            <Logo variant="compact" />
          </div>

          {/* User Info */}
          {isAuthenticated && user && (
            <div className="px-4 py-4 border-b border-white/8">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/8">
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarImage src={user.profileImage || ""} />
                  <AvatarFallback className="bg-linear-to-br from-purple-600 to-violet-600 text-white text-sm font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-white/35 text-xs truncate mt-0.5">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "text-white bg-white/8 border border-white/12"
                      : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-purple-400" : "text-white/30")} />
                  <span className="flex-1">{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                  )}
                </Link>
              );
            })}

            {isAuthenticated && (
              <>
                <div className="h-px bg-white/8 my-3" />
                <Link
                  href={dashboardRoute}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                    pathname.startsWith("/dashboard")
                      ? "text-white bg-white/8 border-white/12"
                      : "text-white/50 hover:text-white hover:bg-white/5 border-transparent"
                  )}
                >
                  <LayoutDashboard className={cn("w-4 h-4 shrink-0", pathname.startsWith("/dashboard") ? "text-purple-400" : "text-white/30")} />
                  <span className="flex-1">Dashboard</span>
                  {pathname.startsWith("/dashboard") && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                  )}
                </Link>
                <Link
                  href={ROUTES.MEMBER_PROFILE}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                    pathname === ROUTES.MEMBER_PROFILE
                      ? "text-white bg-white/8 border-white/12"
                      : "text-white/50 hover:text-white hover:bg-white/5 border-transparent"
                  )}
                >
                  <User className={cn("w-4 h-4 shrink-0", pathname === ROUTES.MEMBER_PROFILE ? "text-purple-400" : "text-white/30")} />
                  <span className="flex-1">Profile</span>
                  {pathname === ROUTES.MEMBER_PROFILE && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                  )}
                </Link>
              </>
            )}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-white/8 space-y-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="flex-1 text-left">Logout</span>
              </button>
            ) : (
              <>
                <Link href={ROUTES.LOGIN} onClick={() => setOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer">
                    Log in
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
                <Link href={ROUTES.REGISTER} onClick={() => setOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_28px_rgba(139,92,246,0.55)] transition-all cursor-pointer border-0">
                    Sign Up Free
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </>
            )}
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}
