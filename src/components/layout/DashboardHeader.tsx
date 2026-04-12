"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ArrowLeft, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { getInitials } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push(ROUTES.HOME);
  };

  return (
    <header className="navbar-glass h-16 flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to site
        </Link>

        {title && (
          <>
            <span className="text-white/20 text-lg font-light">/</span>
            <h1 className="text-white font-semibold text-sm">{title}</h1>
          </>
        )}
      </div>

      {/* Right */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 glass rounded-xl px-3 py-2 hover:bg-white/5 transition-colors group outline-none">
              <Avatar className="w-7 h-7">
                <AvatarImage src={user.profileImage ?? ""} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-700 text-white text-xs font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-white text-xs font-medium leading-tight">
                  {user.name}
                </p>
                <p className="text-white/40 text-[10px] leading-tight capitalize">
                  {user.role?.toLowerCase()}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 transition-colors ml-0.5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="glass gradient-border rounded-xl w-48 p-1 border-0 shadow-xl shadow-black/40 bg-[#0f1220]"
          >
            <DropdownMenuLabel className="text-white/50 text-xs px-2 py-1.5">
              Signed in as
              <span className="block text-white font-medium truncate">
                {user.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10 my-1" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 rounded-lg cursor-pointer text-sm px-2 py-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}