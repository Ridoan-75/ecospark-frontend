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
  Leaf,
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
      {/* Glass navbar */}
      <nav className="navbar-glass mx-4 mt-4 rounded-2xl px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-gradient flex items-center justify-center glow-purple-sm">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Eco<span className="gradient-text-purple">Spark</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "text-white bg-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                <Link href={dashboardRoute}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white hover:bg-white/10 gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 glass rounded-xl px-3 py-1.5 hover:bg-white/10 transition-all">
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={user.profileImage || ""} />
                        <AvatarFallback className="bg-purple-600 text-white text-xs">
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
                    className="w-48 glass border-white/10 bg-dark-200/90 backdrop-blur-xl text-white"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href={ROUTES.MEMBER_PROFILE}
                        className="flex items-center gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10"
                      >
                        <User className="w-4 h-4 text-purple-400" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href={dashboardRoute}
                        className="flex items-center gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-400" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center gap-2 cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href={ROUTES.LOGIN}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <Button
                    size="sm"
                    className="btn-glow text-white border-0"
                  >
                    Sign Up →
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
          <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-1 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                  pathname === link.href
                    ? "text-white bg-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/10">
              {isAuthenticated ? (
                <>
                  <Link href={dashboardRoute} onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full text-white/70 hover:text-white hover:bg-white/10 justify-start gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full text-red-400 hover:bg-red-500/10 justify-start gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full text-white/70 hover:text-white hover:bg-white/10">
                      Log in
                    </Button>
                  </Link>
                  <Link href={ROUTES.REGISTER} onClick={() => setMobileOpen(false)}>
                    <Button className="w-full btn-glow text-white border-0">
                      Sign Up →
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