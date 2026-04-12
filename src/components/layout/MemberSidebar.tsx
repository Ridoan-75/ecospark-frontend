"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Lightbulb,
  CreditCard,
  UserCircle,
  Leaf,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

const navItems = [
  {
    label: "Overview",
    href: ROUTES.MEMBER_DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "My Ideas",
    href: ROUTES.MEMBER_IDEAS,
    icon: Lightbulb,
  },
  {
    label: "Payments",
    href: ROUTES.MEMBER_PAYMENTS,
    icon: CreditCard,
  },
  {
    label: "Profile",
    href: ROUTES.MEMBER_PROFILE,
    icon: UserCircle,
  },
];

export function MemberSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar-glass h-screen w-64 flex flex-col py-6 px-4 gap-2 sticky top-0 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Leaf className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">
            EcoSpark
          </p>
          <p className="text-white/40 text-xs">Member Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
          Navigation
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
                  ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-white border border-emerald-500/20 shadow-sm"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive
                    ? "text-emerald-400"
                    : "text-white/30 group-hover:text-white/60"
                )}
              />
              <span className="flex-1">{label}</span>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom CTA */}
      <div className="glass rounded-xl px-3 py-3 mt-2">
        <p className="text-white/40 text-xs leading-relaxed">
          Share your green ideas and help build a sustainable future.
        </p>
        <Link
          href={ROUTES.MEMBER_CREATE_IDEA}
          className="mt-2 flex items-center gap-1.5 text-emerald-400 text-xs font-medium hover:text-emerald-300 transition-colors"
        >
          <Lightbulb className="w-3 h-3" />
          Submit a new idea
        </Link>
      </div>
    </aside>
  );
}