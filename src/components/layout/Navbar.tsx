"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import Logo from "@/components/shared/Logo";

const navLinks = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Ideas", href: ROUTES.IDEAS },
  { label: "How It Works", href: ROUTES.HOW_IT_WORKS },
  { label: "About", href: ROUTES.ABOUT },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardRoute = isAdmin
    ? ROUTES.ADMIN_DASHBOARD
    : ROUTES.MEMBER_DASHBOARD;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="backdrop-blur-3xl bg-dark-400/75 border border-white/20 shadow-2xl mx-2 mt-3 rounded-2xl px-5 py-3" style={{ backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))" }}>

        {/* 3 column layout: Logo | Nav Links | Buttons */}
        <div className="flex items-center justify-between relative h-12">

          {/* LEFT — Logo */}
          <div className="flex-shrink-0">
            <Logo variant="compact" />
          </div>

          {/* CENTER — Nav Links */}
          <div className="hidden md:flex lg:absolute lg:left-1/2 lg:-translate-x-1/2 items-center gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-purple-400 bg-purple-500/10 border border-purple-400/30"
                    : "text-white/60 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* RIGHT — Auth Buttons */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {isAuthenticated && user ? (
              <>
                {/* Dashboard Button */}
                <Link href={dashboardRoute}>
                  <Button
                    size="sm"
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 gap-2 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-200 font-medium bg-transparent h-10 px-4 rounded-lg text-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-purple-500/10 transition-all border border-purple-400/30 hover:border-purple-400/50 duration-200 h-10 cursor-pointer">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={user.profileImage || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-violet-600 text-white text-[10px] font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white/80 text-sm font-medium">
                        {user.name.split(" ")[0]}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-52 border-purple-400/30 bg-dark-200/90 backdrop-blur-xl text-white shadow-xl rounded-xl"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href={ROUTES.MEMBER_PROFILE}
                        className="flex items-center gap-3 cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10 transition-all duration-200 py-2.5"
                      >
                        <User className="w-4 h-4 text-purple-400" />
                        <span className="font-medium">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={dashboardRoute}
                        className="flex items-center gap-3 cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10 transition-all duration-200 py-2.5"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-400" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center gap-3 cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300 transition-all duration-200 py-2.5"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href={ROUTES.LOGIN}>
                  <Button
                    size="sm"
                    className="text-white/75 hover:text-white hover:bg-white/5 border border-white/15 hover:border-white/25 transition-all duration-200 font-medium bg-transparent h-10 px-5 rounded-lg text-sm"
                  >
                    Log in
                  </Button>
                </Link>

                {/* Divider */}
                <div className="w-px h-5 bg-white/10" />

                <Link href={ROUTES.REGISTER}>
                  <Button
                    size="sm"
                    className="bg-purple-700 hover:bg-purple-800 text-white border-0 transition-all duration-200 font-semibold h-10 px-6 rounded-lg text-sm shadow-[inset_0_0_0_1px_rgba(139,92,246,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_0_16px_rgba(139,92,246,0.40),inset_0_0_0_1px_rgba(139,92,246,0.55)]"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-purple-400 bg-purple-500/10 border border-purple-400/30"
                    : "text-white/70 hover:text-purple-400 hover:bg-purple-500/10 border border-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/10">
              {isAuthenticated ? (
                <>
                  <Link href={dashboardRoute} onClick={() => setMobileOpen(false)}>
                    <Button className="w-full text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 justify-start gap-2 border border-purple-400/30 transition-all font-medium bg-transparent h-10 rounded-xl text-sm">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 justify-start gap-2 border border-red-400/30 transition-all font-medium bg-transparent h-10 rounded-xl text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>
                    <Button className="w-full text-white/80 hover:text-white border border-white/15 hover:bg-white/5 transition-all font-medium bg-transparent h-10 rounded-xl text-sm">
                      Log in
                    </Button>
                  </Link>
                  <Link href={ROUTES.REGISTER} onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-purple-700 hover:bg-purple-800 text-white border-0 font-semibold h-10 rounded-xl text-sm shadow-[inset_0_0_0_1px_rgba(139,92,246,0.45)] hover:shadow-[0_0_16px_rgba(139,92,246,0.35)]">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}