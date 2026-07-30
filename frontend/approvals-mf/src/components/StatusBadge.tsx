import React from "react";

interface StatusBadgeProps {
  status: string;
  customLabels?: Record<string, string>;
}

const defaultLabels: Record<string, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  SIGNED: "Firmado",
  COMPLETED: "Completado",
};

const statusColors: Record<string, string> = {
  PENDING: "#f59e0b",
  APPROVED: "#10b981",
  REJECTED: "#ef4444",
  SIGNED: "#3b82f6",
  COMPLETED: "#10b981",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, customLabels }) => {
  const label = customLabels?.[status] || defaultLabels[status] || status;
  const color = statusColors[status] || "#6b7280";

  return (
    <span className="status-badge" style={{ backgroundColor: color }}>
      {label}
    </span>
  );
};

export default StatusBadge;
