import React from "react";
import Card from "../components/ui/Card";
import StatusBadge from "./StatusBadge";
import { IconInfo, IconDollar, IconUsers, IconClock } from "../components/ui/Icons";
import type { PurchaseRequest } from "../types/approval.types";

interface ApprovalDetailProps {
  request: PurchaseRequest;
}

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(amount);

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const ApprovalDetail: React.FC<ApprovalDetailProps> = ({ request }) => (
  <Card padding={false}>
    <div className="px-6 py-5 border-b border-gray-100">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">{request.title}</h2>
        <StatusBadge status={request.status} size="md" />
      </div>
    </div>

    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex items-start gap-3">
          <IconInfo size={18} className="text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</p>
            <p className="text-sm text-gray-900 mt-0.5">{request.description}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <IconDollar size={18} className="text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</p>
            <p className="text-lg font-semibold text-gray-900 mt-0.5">{formatCurrency(request.amount)}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <IconUsers size={18} className="text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</p>
            <p className="text-sm text-gray-900 mt-0.5">{request.requesterId}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <IconClock size={18} className="text-gray-400 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Creada</p>
            <p className="text-sm text-gray-900 mt-0.5">{formatDate(request.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  </Card>
);

export default ApprovalDetail;
