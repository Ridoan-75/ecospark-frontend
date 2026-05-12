"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardRoute = isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.MEMBER_DASHBOARD;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={cn(
          "border-b md:border border-white/10 md:mx-2 lg:mx-3 md:mt-3 md:rounded-2xl px-4 md:px-8 transition-all duration-300",
          scrolled
            ? "backdrop-blur-3xl bg-dark-400/95 shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:border-white/20"
            : "backdrop-blur-2xl bg-dark-400/70 shadow-xl"
        )}
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))",
        }}
      >
        <div className="flex items-center h-[72px] gap-4">

          {/* LEFT — Logo */}
          <div className="shrink-0">
            <Logo variant="compact" />
          </div>

          {/* CENTER — Nav Links (desktop only) */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap group",
                    isActive
                      ? "text-white"
                      : "text-white/50 hover:text-white"
                  )}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-xl bg-white/8 border border-white/12" />
                  )}
                  <span className="relative">{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-400" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* DIVIDER */}
          <div className="hidden lg:block w-px h-6 bg-white/10 shrink-0" />

          {/* RIGHT — Desktop Auth */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {!hasHydrated ? (
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-20 rounded-xl bg-white/8" />
                <Skeleton className="h-9 w-24 rounded-xl bg-white/8" />
              </div>
            ) : isAuthenticated && user ? (
              <>
                <Link href={dashboardRoute}>
                  <Button
                    size="sm"
                    className="text-white/60 hover:text-white hover:bg-white/8 gap-2 border border-white/10 hover:border-white/20 transition-all duration-200 bg-transparent h-9 px-4 rounded-xl text-sm font-medium cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-white/8 transition-all border border-white/10 hover:border-white/20 duration-200 h-9 cursor-pointer">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={user.profileImage || ""} />
                        <AvatarFallback className="bg-linear-to-br from-purple-600 to-violet-600 text-white text-[9px] font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white/75 text-sm font-medium">
                        {user.name.split(" ")[0]}
                      </span>
                      <ChevronDown className="w-3 h-3 text-white/30" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-52 border-white/12 bg-dark-200/95 backdrop-blur-xl text-white shadow-2xl rounded-xl mt-1"
                  >
                    <div className="px-3 py-2.5 border-b border-white/8">
                      <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-white/35 text-xs truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <DropdownMenuItem asChild>
                        <Link href={ROUTES.MEMBER_PROFILE} className="flex items-center gap-3 cursor-pointer hover:bg-white/6 focus:bg-white/6 transition-all py-2 px-3 rounded-lg mx-1">
                          <User className="w-4 h-4 text-purple-400" />
                          <span className="font-medium text-sm">Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={dashboardRoute} className="flex items-center gap-3 cursor-pointer hover:bg-white/6 focus:bg-white/6 transition-all py-2 px-3 rounded-lg mx-1">
                          <LayoutDashboard className="w-4 h-4 text-purple-400" />
                          <span className="font-medium text-sm">Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator className="bg-white/8 mx-2" />
                    <div className="py-1">
                      <DropdownMenuItem onClick={logout} className="flex items-center gap-3 cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300 transition-all py-2 px-3 rounded-lg mx-1">
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium text-sm">Logout</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href={ROUTES.LOGIN}>
                  <Button
                    size="sm"
                    className="text-white/60 hover:text-white hover:bg-white/6 border border-white/10 hover:border-white/20 transition-all duration-200 bg-transparent h-9 px-5 rounded-xl text-sm font-medium cursor-pointer"
                  >
                    Log in
                  </Button>
                </Link>

                <Link href={ROUTES.REGISTER}>
                  <Button
                    size="sm"
                    className="bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 transition-all duration-200 font-semibold h-9 px-5 rounded-xl text-sm shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_28px_rgba(139,92,246,0.55)] cursor-pointer"
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
