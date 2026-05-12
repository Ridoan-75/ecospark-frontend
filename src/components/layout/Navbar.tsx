"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { LayoutDashboard, LogOut, User, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
import MobileNav from "../layout/MobileNav";

const navLinks = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Ideas", href: ROUTES.IDEAS },
  { label: "How It Works", href: ROUTES.HOW_IT_WORKS },
  { label: "About", href: ROUTES.ABOUT },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, hasHydrated, logout } = useAuth();

  const dashboardRoute = isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.MEMBER_DASHBOARD;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className="backdrop-blur-3xl bg-dark-400/80 border-b md:border border-white/15 shadow-2xl md:mx-3 lg:mx-6 md:mt-3 md:rounded-2xl px-4 md:px-5"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
        }}
      >
        <div className="flex items-center h-14 gap-4">

          {/* LEFT — Logo */}
          <div className="shrink-0">
            <Logo variant="compact" />
          </div>

          {/* CENTER — Nav Links (desktop only) */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  pathname === link.href
                    ? "text-purple-400 bg-purple-500/10 border border-purple-400/30"
                    : "text-white/65 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* RIGHT — Desktop Auth */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {!hasHydrated ? (
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-24 rounded-xl bg-white/8" />
                <Skeleton className="h-10 w-24 rounded-xl bg-white/8" />
              </div>
            ) : isAuthenticated && user ? (
              <>
                <Link href={dashboardRoute}>
                  <Button
                    size="sm"
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 gap-2 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-200 bg-transparent h-10 px-4 rounded-xl text-sm font-medium cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-purple-500/10 transition-all border border-purple-400/30 hover:border-purple-400/50 duration-200 h-10 cursor-pointer">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={user.profileImage || ""} />
                        <AvatarFallback className="bg-linear-to-br from-purple-600 to-violet-600 text-white text-[10px] font-semibold">
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
                      <Link href={ROUTES.MEMBER_PROFILE} className="flex items-center gap-3 cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10 transition-all py-2.5">
                        <User className="w-4 h-4 text-purple-400" />
                        <span className="font-medium">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={dashboardRoute} className="flex items-center gap-3 cursor-pointer hover:bg-purple-500/10 focus:bg-purple-500/10 transition-all py-2.5">
                        <LayoutDashboard className="w-4 h-4 text-purple-400" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem onClick={logout} className="flex items-center gap-3 cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300 transition-all py-2.5">
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
                    className="text-white/75 hover:text-white hover:bg-white/5 border border-white/15 hover:border-white/25 transition-all duration-200 bg-transparent h-10 px-5 rounded-xl text-sm font-medium cursor-pointer"
                  >
                    Log in
                  </Button>
                </Link>

                <Link href={ROUTES.REGISTER}>
                  <Button
                    size="sm"
                    className="bg-purple-700 hover:bg-purple-800 text-white border-0 transition-all duration-200 font-semibold h-10 px-6 rounded-xl text-sm shadow-[inset_0_0_0_1px_rgba(139,92,246,0.45)] hover:shadow-[0_0_16px_rgba(139,92,246,0.40)] cursor-pointer"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* RIGHT — Mobile Hamburger */}
          <div className="lg:hidden flex flex-1 justify-end">
            <MobileNav />
          </div>

        </div>
      </nav>
    </header>
  );
}
