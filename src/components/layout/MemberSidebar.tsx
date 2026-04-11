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
} from "lucide-react";

const memberLinks = [
  { label: "Overview", href: ROUTES.MEMBER_DASHBOARD, icon: LayoutDashboard },
  { label: "My Ideas", href: ROUTES.MEMBER_IDEAS, icon: Lightbulb },
  { label: "My Payments", href: ROUTES.MEMBER_PAYMENTS, icon: CreditCard },
  { label: "Profile", href: ROUTES.MEMBER_PROFILE, icon: User },
];

export default function MemberSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-200">
        <Link href="/" className="text-xl font-bold text-green-600">
          🌿 EcoSpark
        </Link>
        <p className="text-xs text-slate-500 mt-1">Member Dashboard</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {memberLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}