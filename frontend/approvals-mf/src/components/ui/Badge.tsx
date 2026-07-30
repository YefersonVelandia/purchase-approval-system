import React from "react";

type BadgeVariant = "pending" | "approved" | "rejected" | "signed" | "completed" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  rejected: "bg-red-50 text-red-700 border border-red-200",
  signed: "bg-blue-50 text-blue-700 border border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  default: "bg-gray-50 text-gray-700 border border-gray-200",
};

export const getStatusVariant = (status: string): BadgeVariant => {
  const map: Record<string, BadgeVariant> = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    SIGNED: "signed",
    COMPLETED: "completed",
  };
  return map[status] || "default";
};

const Badge: React.FC<BadgeProps> = ({ variant = "default", children, className = "" }) => (
  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${variantClasses[variant]} ${className}`}>
    {children}
  </span>
);

export default Badge;
