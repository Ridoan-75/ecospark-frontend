"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, Home, Bell, Menu, X, LayoutDashboard, Users, Lightbulb, Tag, CreditCard, Mail, User, Plus, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";

const adminLinks = [
  { label: "Overview", href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { label: "Users", href: ROUTES.ADMIN_USERS, icon: Users },
  { label: "Ideas", href: ROUTES.ADMIN_IDEAS, icon: Lightbulb },
  { label: "Categories", href: ROUTES.ADMIN_CATEGORIES, icon: Tag },
  { label: "Payments", href: ROUTES.ADMIN_PAYMENTS, icon: CreditCard },
  { label: "Newsletter", href: ROUTES.ADMIN_NEWSLETTER, icon: Mail },
];

const memberLinks = [
  { label: "Overview", href: ROUTES.MEMBER_DASHBOARD, icon: LayoutDashboard },
  { label: "My Ideas", href: ROUTES.MEMBER_IDEAS, icon: Lightbulb },
  { label: "My Payments", href: ROUTES.MEMBER_PAYMENTS, icon: CreditCard },
  { label: "Profile", href: ROUTES.MEMBER_PROFILE, icon: User },
];

export default function DashboardHeader() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = isAdmin ? adminLinks : memberLinks;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully", {
      duration: 3000,
    });
    router.push(ROUTES.LOGIN);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href.split("?")[0]);

  return (
    <>
      <header className="navbar-glass border-b border-white/8 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 flex items-center justify-between shrink-0">

        {/* Left — Mobile Menu Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/40 text-xs sm:text-sm">
              {isAdmin ? "Admin Panel" : "Member Panel"}
            </span>
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

        {/* Back to site */}
        <Link href={ROUTES.HOME}>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/40 hover:text-white hover:bg-white/10 gap-2 rounded-xl h-9"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-xs">Back to site</span>
          </Button>
        </Link>

        {/* User Dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 glass rounded-xl px-3 py-1.5 hover:bg-white/10 transition-all cursor-pointer">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={user.profileImage || ""} />
                  <AvatarFallback className="bg-purple-600 text-white text-xs font-bold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-white text-xs font-medium leading-none">
                    {user.name.split(" ")[0]}
                  </p>
                  <p className="text-white/30 text-[10px] mt-0.5">
                    {user.role}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 bg-dark-200/95 backdrop-blur-xl border-white/10 text-white"
            >
              <div className="px-3 py-2 border-b border-white/10">
                <p className="text-white text-sm font-medium truncate">
                  {user.name}
                </p>
                <p className="text-white/40 text-xs truncate">{user.email}</p>
              </div>

              <DropdownMenuItem asChild>
                <Link
                  href={
                    isAdmin
                      ? ROUTES.ADMIN_DASHBOARD
                      : ROUTES.MEMBER_PROFILE
                  }
                  className="flex items-center gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10 mt-1"
                >
                  <span className="text-sm">
                    {isAdmin ? "Admin Dashboard" : "My Profile"}
                  </span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-white/10" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="text-sm">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 lg:hidden z-40 bg-dark-400/50 backdrop-blur-sm">
          <div className="absolute left-0 top-0 right-0 max-w-xs bg-dark-300 border-r border-white/8 min-h-full overflow-y-auto">
            {/* Navigation Links */}
            <nav className="p-3 space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      active
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                        : "text-white/50 hover:text-white hover:bg-white/8"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Create Idea CTA for Members */}
            {!isAdmin && (
              <div className="p-3 border-t border-white/8">
                <Link href={ROUTES.MEMBER_CREATE_IDEA} onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer">
                    <Plus className="w-4 h-4" />
                    New Idea
                  </button>
                </Link>
              </div>
            )}

            {/* Admin Badge for Admins */}
            {isAdmin && (
              <div className="p-3">
                <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 text-xs font-medium">
                    Administrator Access
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}