"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User,
  Home,
  Lightbulb,
  Info,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

  const dashboardRoute = isAdmin
    ? ROUTES.ADMIN_DASHBOARD
    : ROUTES.MEMBER_DASHBOARD;

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push(ROUTES.HOME);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="text-white/70 hover:text-white p-1 transition-colors cursor-pointer">
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-72 sidebar-glass border-l border-purple-500/15 text-white p-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-white/8 flex items-center justify-between">
            <Logo variant="compact" />
          </div>

          {/* User Info */}
          {isAuthenticated && user && (
            <div className="p-5 border-b border-white/8">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.profileImage || ""} />
                  <AvatarFallback className="bg-purple-600 text-white text-sm">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {user.name}
                  </p>
                  <p className="text-white/40 text-xs truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <nav className="flex-1 p-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-purple-500/15 text-purple-300 border border-purple-500/25"
                      : "text-white/60 hover:text-white hover:bg-white/5",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}

            {isAuthenticated && (
              <>
                <div className="h-px bg-white/8 my-2" />
                <Link
                  href={dashboardRoute}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href={ROUTES.MEMBER_PROFILE}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              </>
            )}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-white/8">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href={ROUTES.LOGIN} onClick={() => setOpen(false)}>
                  <Button className="w-full btn-glass text-white/70 hover:text-white rounded-xl">
                    Log in
                  </Button>
                </Link>
                <Link href={ROUTES.REGISTER} onClick={() => setOpen(false)}>
                  <Button className="w-full btn-glow text-white border-0 rounded-xl">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
