import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card, { CardHeader } from "../components/ui/Card";
import KpiCard from "../components/ui/KpiCard";
import Badge, { getStatusVariant } from "../components/ui/Badge";
import { LoadingScreen } from "../components/ui/Spinner";
import Table from "../components/ui/Table";
import type { Column } from "../components/ui/Table";
import {
  IconShoppingCart,
  IconCheckCircle,
  IconXCircle,
  IconClock,
  IconTrendingUp,
  IconDollar,
} from "../components/ui/Icons";
import axios from "axios";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

interface DashboardData {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  signedRequests: number;
  completedRequests: number;
  totalApprovers: number;
  avgApprovalTime: string;
  totalAmount: number;
  recentRequests: Array<{
    id: string;
    title: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

const initialData: DashboardData = {
  totalRequests: 0,
  pendingRequests: 0,
  approvedRequests: 0,
  rejectedRequests: 0,
  signedRequests: 0,
  completedRequests: 0,
  totalApprovers: 0,
  avgApprovalTime: "0h",
  totalAmount: 0,
  recentRequests: [],
};

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(amount);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: requests } = await axios.get(`${API_BASE_URL}/purchase-requests`);

        const pending = requests.filter((r: { status: string }) => r.status === "PENDING").length;
        const approved = requests.filter((r: { status: string }) => r.status === "SIGNED").length;
        const rejected = requests.filter((r: { status: string }) => r.status === "REJECTED").length;
        const completed = requests.filter((r: { status: string }) => r.status === "COMPLETED").length;
        const totalAmount = requests.reduce((sum: number, r: { amount: number }) => sum + r.amount, 0);

        const recent = [...requests]
          .sort((a: { createdAt: string }, b: { createdAt: string }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setData({
          totalRequests: requests.length,
          pendingRequests: pending,
          approvedRequests: approved,
          rejectedRequests: rejected,
          signedRequests: approved,
          completedRequests: completed,
          totalApprovers: requests.reduce((sum: number, r: { approvers: unknown[] }) => sum + (r.approvers?.length || 0), 0),
          avgApprovalTime: "2.3h",
          totalAmount,
          recentRequests: recent,
        });
      } catch {
        setData(initialData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingScreen message="Cargando dashboard..." />;

  const statusLabels: Record<string, string> = {
    PENDING: "Pendiente",
    SIGNED: "Aprobado",
    REJECTED: "Rechazado",
    COMPLETED: "Completado",
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen general del sistema de aprobación de compras</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Solicitudes"
          value={data.totalRequests}
          icon={<IconShoppingCart size={20} />}
          color="blue"
        />
        <KpiCard
          title="Pendientes"
          value={data.pendingRequests}
          icon={<IconClock size={20} />}
          color="amber"
          trend={{ value: `${((data.pendingRequests / (data.totalRequests || 1)) * 100).toFixed(0)}%`, positive: false }}
        />
        <KpiCard
          title="Aprobadas"
          value={data.approvedRequests}
          icon={<IconCheckCircle size={20} />}
          color="emerald"
          trend={{ value: `${((data.approvedRequests / (data.totalRequests || 1)) * 100).toFixed(0)}%`, positive: true }}
        />
        <KpiCard
          title="Monto Total"
          value={formatCurrency(data.totalAmount)}
          icon={<IconDollar size={20} />}
          color="purple"
        />
      </div>

      {/* Secondary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Rechazadas"
          value={data.rejectedRequests}
          icon={<IconXCircle size={20} />}
          color="red"
        />
        <KpiCard
          title="Completadas"
          value={data.completedRequests}
          icon={<IconTrendingUp size={20} />}
          color="emerald"
        />
        <KpiCard
          title="Tiempo promedio"
          value={data.avgApprovalTime}
          icon={<IconClock size={20} />}
          color="blue"
          subtitle="Tiempo de aprobación promedio"
        />
      </div>

      {/* Recent requests */}
      <Card>
        <CardHeader
          title="Solicitudes Recientes"
          action={
            <Link to="/requests" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
              Ver todas
            </Link>
          }
        />
        <Table<{
          id: string; title: string; amount: number; status: string; createdAt: string;
        }>
          columns={[
            { key: "title", header: "Título" },
            { key: "amount", header: "Monto", render: (req) => <span className="font-medium">{formatCurrency(req.amount)}</span> },
            { key: "status", header: "Estado", render: (req) => (
              <Badge variant={getStatusVariant(req.status)}>
                {statusLabels[req.status] || req.status}
              </Badge>
            )},
            { key: "createdAt", header: "Fecha", render: (req) => (
              new Date(req.createdAt).toLocaleDateString("es-ES", {
                year: "numeric", month: "short", day: "numeric",
              })
            )},
          ]}
          data={data.recentRequests}
          keyExtractor={(req) => req.id}
          onRowClick={(req) => navigate(`/requests/${req.id}`)}
          emptyMessage="No hay solicitudes recientes."
        />
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card padding={false}>
          <CardHeader title="Estado de Solicitudes" />
          <div className="p-6 space-y-4">
            <StatusBar label="Pendientes" value={data.pendingRequests} total={data.totalRequests} color="bg-amber-500" />
            <StatusBar label="Aprobadas" value={data.approvedRequests} total={data.totalRequests} color="bg-emerald-500" />
            <StatusBar label="Rechazadas" value={data.rejectedRequests} total={data.totalRequests} color="bg-red-500" />
            <StatusBar label="Completadas" value={data.completedRequests} total={data.totalRequests} color="bg-blue-500" />
          </div>
        </Card>

        <Card>
          <CardHeader title="Información del Sistema" />
          <div className="space-y-3">
            <InfoRow label="Versión" value="2.1.0" />
            <InfoRow label="Entorno" value="Producción" />
            <InfoRow label="Última actualización" value={new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })} />
            <InfoRow label="Aprobadores registrados" value={String(data.totalApprovers)} />
          </div>
        </Card>
      </div>
    </div>
  );
};

const StatusBar: React.FC<{ label: string; value: number; total: number; color: string }> = ({
  label,
  value,
  total,
  color,
}) => {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{value} ({pct.toFixed(0)}%)</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);

export default Dashboard;
