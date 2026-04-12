"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Lightbulb,
  Tag,
  CreditCard,
  Mail,
  Leaf,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

const navItems = [
  {
    label: "Overview",
    href: ROUTES.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: ROUTES.ADMIN_USERS,
    icon: Users,
  },
  {
    label: "Ideas",
    href: ROUTES.ADMIN_IDEAS,
    icon: Lightbulb,
  },
  {
    label: "Categories",
    href: ROUTES.ADMIN_CATEGORIES,
    icon: Tag,
  },
  {
    label: "Payments",
    href: ROUTES.ADMIN_PAYMENTS,
    icon: CreditCard,
  },
  {
    label: "Newsletter",
    href: ROUTES.ADMIN_NEWSLETTER,
    icon: Mail,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar-glass h-screen w-64 flex flex-col py-6 px-4 gap-2 sticky top-0 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <Leaf className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">
            EcoSpark
          </p>
          <p className="text-white/40 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Admin badge */}
      <div className="flex items-center gap-2 px-3 mb-4">
        <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
        <span className="badge-purple rounded-full px-3 py-1 text-xs">
          Administrator
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
          Management
        </p>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-violet-500/20 to-purple-500/10 text-white border border-violet-500/20 shadow-sm"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive
                    ? "text-violet-400"
                    : "text-white/30 group-hover:text-white/60"
                )}
              />
              <span className="flex-1">{label}</span>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-violet-400/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* System note */}
      <div className="glass rounded-xl px-3 py-3 mt-2 border border-violet-500/10">
        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest mb-1">
          System
        </p>
        <p className="text-white/40 text-xs leading-relaxed">
          You have full access to manage platform content and users.
        </p>
      </div>
    </aside>
  );
}