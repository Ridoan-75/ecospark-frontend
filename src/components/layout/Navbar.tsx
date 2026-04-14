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
      {/* Glass navbar with enhanced styling */}
      <nav className="backdrop-blur-xl bg-gradient-to-r from-dark-400/40 via-dark-300/40 to-dark-400/40 border border-white/10 shadow-2xl mx-1 mt-3 rounded-2xl px-4 py-3">
        <div className="max-w-full mx-auto flex items-center justify-between px-3">

          {/* Logo */}
          <Logo variant="compact" />

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group",
                  pathname === link.href
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-400/30"
                    : "text-white/70 hover:text-emerald-400 hover:bg-emerald-500/10"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <div className="absolute bottom-1 left-4 right-4 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <Link href={dashboardRoute}>
                  <Button
                    size="lg"
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 gap-2 border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-200 font-medium bg-transparent h-10 px-5"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Button>
                </Link>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 glass rounded-xl px-4 py-2.5 hover:bg-emerald-500/10 transition-all border border-emerald-400/30 hover:border-emerald-400/50 duration-200 h-10">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.profileImage || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-xs font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white/80 text-sm font-medium">
                        {user.name.split(" ")[0]}
                      </span>
                      <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
                    </button>
                  </DropdownMenuTrigger>

                    <DropdownMenuContent
                    align="end"
                    className="w-52 glass border-emerald-400/30 bg-dark-200/90 backdrop-blur-xl text-white shadow-xl"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href={ROUTES.MEMBER_PROFILE}
                        className="flex items-center gap-3 cursor-pointer hover:bg-emerald-500/10 focus:bg-emerald-500/10 transition-all duration-200 py-2.5"
                      >
                        <User className="w-5 h-5 text-emerald-400" />
                        <span className="font-medium">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={dashboardRoute}
                        className="flex items-center gap-3 cursor-pointer hover:bg-emerald-500/10 focus:bg-emerald-500/10 transition-all duration-200 py-2.5"
                      >
                        <LayoutDashboard className="w-5 h-5 text-emerald-400" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center gap-3 cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300 transition-all duration-200 py-2.5"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href={ROUTES.LOGIN}>
                  <Button
                    size="lg"
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-200 font-semibold bg-transparent h-10 px-6"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg hover:shadow-emerald-500/50 shadow-emerald-500/30 transition-all duration-200 font-semibold h-10 px-6"
                  >
                    Sign up
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
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-2 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-400/30"
                    : "text-white/70 hover:text-emerald-400 hover:bg-emerald-500/10"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-white/10">
              {isAuthenticated ? (
                <>
                  <Link href={dashboardRoute} onClick={() => setMobileOpen(false)}>
                    <Button className="w-full text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 justify-start gap-2 border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-200 font-semibold bg-transparent h-11">
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 justify-start gap-2 border border-transparent hover:border-red-400/30 transition-all duration-200 font-semibold bg-transparent h-11"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>
                    <Button className="w-full text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-200 font-semibold bg-transparent h-11">
                      Log in
                    </Button>
                  </Link>
                  <Link href={ROUTES.REGISTER} onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg hover:shadow-emerald-500/50 shadow-emerald-500/30 transition-all duration-200 font-semibold h-11">
                      Sign up
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