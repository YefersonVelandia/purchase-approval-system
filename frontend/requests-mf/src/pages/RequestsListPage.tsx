import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Badge, { getStatusVariant } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { LoadingScreen } from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Pagination from "../components/ui/Pagination";
import Table from "../components/ui/Table";
import { IconShoppingCart, IconPlus } from "../components/ui/Icons";
import { requestsService } from "../services/requests.service";
import type { PurchaseRequest } from "../types/request.types";
import Input from "../components/ui/Input";

const ITEMS_PER_PAGE = 8;

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  SIGNED: "Aprobado",
  REJECTED: "Rechazado",
  COMPLETED: "Completado",
};

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD" }).format(amount);

const RequestsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<string>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    requestsService
      .list()
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar las solicitudes");
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let result = [...requests];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "amount") cmp = a.amount - b.amount;
      else if (sortKey === "createdAt")
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else
        cmp = String(a[sortKey as keyof PurchaseRequest]).localeCompare(
          String(b[sortKey as keyof PurchaseRequest]),
        );
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [requests, search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  if (loading) return <LoadingScreen message="Cargando solicitudes..." />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Solicitudes de Compra</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} solicitud{filtered.length !== 1 ? "es" : ""} encontrada
            {filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => navigate("/requests/create")}>
          <IconPlus size={16} />
          Nueva Solicitud
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Buscar por título, descripción o ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full pl-10 pr-8 py-2.5 text-sm border border-gray-300 rounded-lg bg-white shadow-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 appearance-none"
          >
            <option value="all">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="SIGNED">Aprobado</option>
            <option value="REJECTED">Rechazado</option>
            <option value="COMPLETED">Completado</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconShoppingCart size={48} />}
            title={
              search || statusFilter !== "all" ? "Sin resultados" : "No hay solicitudes registradas"
            }
            description={
              search || statusFilter !== "all"
                ? "Intenta ajustar los filtros de búsqueda."
                : "Crea tu primera solicitud de compra para comenzar."
            }
            action={
              !search && statusFilter === "all" ? (
                <Button onClick={() => navigate("/requests/create")}>
                  <IconPlus size={16} />
                  Crear primera solicitud
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <Card padding={false}>
          <Table<PurchaseRequest>
            columns={[
              { key: "title", header: "Título", sortable: true },
              {
                key: "amount",
                header: "Monto",
                sortable: true,
                render: (req) => <span className="font-medium">{formatCurrency(req.amount)}</span>,
              },
              {
                key: "status",
                header: "Estado",
                render: (req) => (
                  <Badge variant={getStatusVariant(req.status)}>
                    {statusLabels[req.status] || req.status}
                  </Badge>
                ),
              },
              {
                key: "createdAt",
                header: "Fecha",
                sortable: true,
                render: (req) =>
                  new Date(req.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }),
              },
              {
                key: "_action",
                header: "Acción",
                className: "text-right",
                render: (req) => (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/requests/${req.id}`);
                    }}
                  >
                    Ver detalle
                  </Button>
                ),
              },
            ]}
            data={paginated}
            keyExtractor={(req) => req.id}
            onRowClick={(req) => navigate(`/requests/${req.id}`)}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
          />
          <div className="px-4 py-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default RequestsListPage;
