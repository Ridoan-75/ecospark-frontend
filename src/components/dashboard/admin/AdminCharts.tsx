"use client";

import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { TIdea } from "@/types/idea.types";
import { TPayment } from "@/types/payment.types";

type TProps = {
  ideas: TIdea[];
  payments: TPayment[];
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getLast6Months() {
  const result = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTHS[d.getMonth()] });
  }
  return result;
}

function buildMonthlyIdeasData(ideas: TIdea[]) {
  const months = getLast6Months();
  return months.map(({ key, label }) => {
    const [y, m] = key.split("-").map(Number);
    const count = ideas.filter((idea) => {
      const d = new Date(idea.createdAt);
      return d.getFullYear() === y && d.getMonth() === m;
    }).length;
    return { month: label, Ideas: count };
  });
}

function buildMonthlyRevenueData(payments: TPayment[]) {
  const months = getLast6Months();
  return months.map(({ key, label }) => {
    const [y, m] = key.split("-").map(Number);
    const revenue = payments
      .filter((p) => {
        const d = new Date(p.createdAt);
        return p.status === "SUCCESS" && d.getFullYear() === y && d.getMonth() === m;
      })
      .reduce((sum, p) => sum + p.amount, 0);
    return { month: label, Revenue: parseFloat(revenue.toFixed(2)) };
  });
}

function buildStatusPieData(ideas: TIdea[]) {
  const counts: Record<string, number> = {
    APPROVED: 0,
    UNDER_REVIEW: 0,
    REJECTED: 0,
    DRAFT: 0,
  };
  ideas.forEach((i) => {
    if (counts[i.status] !== undefined) counts[i.status]++;
  });
  return [
    { name: "Approved", value: counts.APPROVED, color: "#22c55e" },
    { name: "Under Review", value: counts.UNDER_REVIEW, color: "#f59e0b" },
    { name: "Rejected", value: counts.REJECTED, color: "#ef4444" },
    { name: "Draft", value: counts.DRAFT, color: "#8b5cf6" },
  ].filter((d) => d.value > 0);
}

const tooltipStyle = {
  backgroundColor: "#1a1a2e",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "#fff",
};

export default function AdminCharts({ ideas, payments }: TProps) {
  const monthlyIdeas = buildMonthlyIdeasData(ideas);
  const monthlyRevenue = buildMonthlyRevenueData(payments);
  const statusPie = buildStatusPieData(ideas);

  return (
    <div className="space-y-4">
      <h2 className="text-white font-semibold">Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Bar Chart — Monthly Ideas */}
        <div className="glass gradient-border rounded-2xl p-5 lg:col-span-1">
          <p className="text-white/60 text-sm font-medium mb-4">Ideas Submitted (Last 6 Months)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyIdeas} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(139,92,246,0.1)" }} />
              <Bar dataKey="Ideas" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart — Monthly Revenue */}
        <div className="glass gradient-border rounded-2xl p-5 lg:col-span-1">
          <p className="text-white/60 text-sm font-medium mb-4">Revenue (Last 6 Months)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyRevenue} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${v}`, "Revenue"]} />
              <Line type="monotone" dataKey="Revenue" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart — Ideas by Status */}
        <div className="glass gradient-border rounded-2xl p-5 lg:col-span-1">
          <p className="text-white/60 text-sm font-medium mb-4">Ideas by Status</p>
          {statusPie.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-white/30 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusPie}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusPie.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  formatter={(value) => <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{value}</span>}
                  iconSize={8}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  );
}
