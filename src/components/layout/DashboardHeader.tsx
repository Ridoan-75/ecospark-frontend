"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Home, Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

export default function DashboardHeader() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully", {
      duration: 3000,
    });
    router.push(ROUTES.LOGIN);
  };

  return (
    <header className="navbar-glass border-b border-white/8 px-6 py-3 flex items-center justify-between shrink-0">

      {/* Left — Page title area */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/40 text-xs">
            {isAdmin ? "Admin Panel" : "Member Panel"}
          </span>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-3">

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
              <button className="flex items-center gap-2.5 glass rounded-xl px-3 py-1.5 hover:bg-white/10 transition-all">
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
  );
}