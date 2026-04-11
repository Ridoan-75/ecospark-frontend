import { Leaf, Users, Globe, TrendingUp } from "lucide-react";

const stats = [
  { icon: Leaf, value: "2,451", label: "Ideas Shared", color: "text-green-400" },
  { icon: Users, value: "12,400+", label: "Members", color: "text-purple-400" },
  { icon: Globe, value: "50+", label: "Countries", color: "text-blue-400" },
  { icon: TrendingUp, value: "98%", label: "Satisfaction", color: "text-amber-400" },
];

export default function StatsSection() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass gradient-border rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="flex justify-center mb-3">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-white/50 text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}