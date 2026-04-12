"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import {
  LayoutDashboard,
  Users,
  Lightbulb,
  Tag,
  CreditCard,
  Mail,
  Leaf,
  ChevronRight,
  Shield,
} from "lucide-react";

const adminLinks = [
  {
    label: "Overview",
    href: ROUTES.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Users",
    href: ROUTES.ADMIN_USERS,
    icon: Users,
    exact: false,
  },
  {
    label: "Ideas",
    href: ROUTES.ADMIN_IDEAS,
    icon: Lightbulb,
    exact: false,
  },
  {
    label: "Categories",
    href: ROUTES.ADMIN_CATEGORIES,
    icon: Tag,
    exact: false,
  },
  {
    label: "Payments",
    href: ROUTES.ADMIN_PAYMENTS,
    icon: CreditCard,
    exact: false,
  },
  {
    label: "Newsletter",
    href: ROUTES.ADMIN_NEWSLETTER,
    icon: Mail,
    exact: false,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="sidebar-glass w-64 min-h-screen flex flex-col shrink-0">

      {/* Logo */}
      <div className="p-6 border-b border-white/8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center glow-purple-sm">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-base leading-none">
              Eco<span className="gradient-text-purple">Spark</span>
            </p>
            <p className="text-white/30 text-[10px] mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Admin Badge */}
      <div className="px-4 pt-4">
        <div className="glass-purple rounded-xl px-3 py-2 flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-purple-300 text-xs font-medium">
            Administrator Access
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href, link.exact);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-purple-500/15 text-purple-300 border border-purple-500/25"
                  : "text-white/50 hover:text-white hover:bg-white/8 border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  active
                    ? "text-purple-400"
                    : "text-white/30 group-hover:text-white/60"
                )}
              />
              <span className="flex-1">{link.label}</span>
              {active && (
                <ChevronRight className="w-3.5 h-3.5 text-purple-400/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/8">
        <Link href={ROUTES.HOME}>
          <button className="w-full btn-glass text-white/50 hover:text-white rounded-xl py-2.5 text-sm flex items-center justify-center gap-2 transition-all">
            <Leaf className="w-4 h-4" />
            View Site
          </button>
        </Link>
      </div>
    </aside>
  );
}