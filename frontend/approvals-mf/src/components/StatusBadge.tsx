import React from "react";

interface StatusBadgeProps {
  status: string;
  customLabels?: Record<string, string>;
  size?: "sm" | "md";
}

const defaultLabels: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  SIGNED: "Firmado",
  COMPLETED: "Completado",
};

const variantClasses: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border border-red-200",
  SIGNED: "bg-blue-50 text-blue-700 border border-blue-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, customLabels, size = "sm" }) => {
  const label = customLabels?.[status] || defaultLabels[status] || status;
  const colorClasses = variantClasses[status] || "bg-gray-50 text-gray-600 border border-gray-200";
  const sizeClasses = size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full ${colorClasses} ${sizeClasses}`}>
      {status === "APPROVED" && (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {status === "REJECTED" && (
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
      {label}
    </span>
  );
};

export default StatusBadge;
