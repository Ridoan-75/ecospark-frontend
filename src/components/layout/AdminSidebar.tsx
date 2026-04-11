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
} from "lucide-react";

const adminLinks = [
  { label: "Overview", href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
  { label: "Users", href: ROUTES.ADMIN_USERS, icon: Users },
  { label: "Ideas", href: ROUTES.ADMIN_IDEAS, icon: Lightbulb },
  { label: "Categories", href: ROUTES.ADMIN_CATEGORIES, icon: Tag },
  { label: "Payments", href: ROUTES.ADMIN_PAYMENTS, icon: CreditCard },
  { label: "Newsletter", href: ROUTES.ADMIN_NEWSLETTER, icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-200">
        <Link href="/" className="text-xl font-bold text-green-600">
          🌿 EcoSpark
        </Link>
        <p className="text-xs text-slate-500 mt-1">Admin Dashboard</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {adminLinks.map((link) => {
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