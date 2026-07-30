import React from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; positive: boolean };
  subtitle?: string;
  color?: "blue" | "emerald" | "amber" | "red" | "purple";
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  purple: "bg-purple-50 text-purple-600",
};

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, trend, subtitle, color = "blue" }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-corporate p-5 transition-all duration-200 hover:shadow-corporate-lg">
    <div className="flex items-start justify-between mb-3">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
      <span className={`p-2 rounded-lg ${colorMap[color]}`}>{icon}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      {trend && (
        <span className={`text-xs font-medium ${trend.positive ? "text-emerald-600" : "text-red-600"}`}>
          {trend.positive ? "+" : ""}{trend.value}
        </span>
      )}
    </div>
    {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
  </div>
);

export default KpiCard;
