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
  ChevronRight,
  Shield,
  Leaf,
  Sparkles,
} from "lucide-react";
import Logo from "@/components/shared/Logo";

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
  {
    label: "AI Insights",
    href: ROUTES.ADMIN_AI,
    icon: Sparkles,
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
      <div className="h-16 px-5 flex items-center border-b border-white/8">
        <Logo variant="full" showSubtitle={true} subtitle="Admin Panel" />
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
            Back to site
          </button>
        </Link>
      </div>
    </aside>
  );
}