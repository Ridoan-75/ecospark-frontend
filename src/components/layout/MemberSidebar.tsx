"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import {
  LayoutDashboard,
  Lightbulb,
  CreditCard,
  User,
  Plus,
  Leaf,
  ChevronRight,
} from "lucide-react";

const memberLinks = [
  {
    label: "Overview",
    href: ROUTES.MEMBER_DASHBOARD,
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "My Ideas",
    href: ROUTES.MEMBER_IDEAS,
    icon: Lightbulb,
    exact: false,
  },
  {
    label: "My Payments",
    href: ROUTES.MEMBER_PAYMENTS,
    icon: CreditCard,
    exact: false,
  },
  {
    label: "Profile",
    href: ROUTES.MEMBER_PROFILE,
    icon: User,
    exact: false,
  },
];

export default function MemberSidebar() {
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
            <p className="text-white/30 text-[10px] mt-0.5">Member Portal</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {memberLinks.map((link) => {
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
                  active ? "text-purple-400" : "text-white/30 group-hover:text-white/60"
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

      {/* Create Idea CTA */}
      <div className="p-4 border-t border-white/8">
        <Link href={ROUTES.MEMBER_CREATE_IDEA}>
          <button className="w-full btn-glow text-white rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            New Idea
          </button>
        </Link>
      </div>
    </aside>
  );
}