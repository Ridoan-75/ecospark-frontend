import AdminOverview from "@/components/dashboard/admin/AdminOverview";
import RecentIdeas from "@/components/dashboard/RecentIdeas";
import { LayoutDashboard, Sparkles } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

export const metadata = { title: "Admin Dashboard" };

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        icon={LayoutDashboard}
        title="Admin Overview"
        description="Platform-wide statistics and recent activity"
      />
      <AdminOverview />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass gradient-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-white font-semibold text-sm">Recent Submissions</h3>
          </div>
          <p className="text-white/30 text-xs">
            Go to <span className="text-purple-400">Ideas</span> tab to review and approve pending submissions.
          </p>
        </div>
        <div className="glass gradient-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-white font-semibold text-sm">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: "Review pending ideas", href: "/dashboard/admin/ideas?status=UNDER_REVIEW" },
              { label: "Manage categories", href: "/dashboard/admin/categories" },
              { label: "View all payments", href: "/dashboard/admin/payments" },
            ].map((a) => (
              <a key={a.label} href={a.href}
                className="block text-white/50 hover:text-purple-400 text-sm py-1.5 border-b border-white/5 last:border-0 transition-colors">
                → {a.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}