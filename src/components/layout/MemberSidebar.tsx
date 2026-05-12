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
  ChevronRight,
  Leaf,
  Sparkles,
} from "lucide-react";
import Logo from "@/components/shared/Logo";

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
  {
    label: "AI Insights",
    href: ROUTES.MEMBER_AI,
    icon: Sparkles,
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
      <div className="h-16 px-5 flex items-center border-b border-white/8">
        <Logo variant="full" showSubtitle={true} subtitle="Member Portal" />
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

      {/* New Idea CTA */}
      <div className="px-4 pb-3 border-t border-white/8 pt-3">
        <Link href={ROUTES.MEMBER_CREATE_IDEA}>
          <button className="w-full btn-glow text-white rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            New Idea
          </button>
        </Link>
      </div>

      {/* Back to site */}
      <div className="px-4 pb-4">
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