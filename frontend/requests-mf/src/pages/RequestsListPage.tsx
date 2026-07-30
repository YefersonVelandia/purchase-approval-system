import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RequestCard from "../components/RequestCard";
import { requestsService } from "../services/requests.service";
import type { PurchaseRequest } from "../types/request.types";

const RequestsListPage: React.FC = () => {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    requestsService
      .list()
      .then(setRequests)
      .catch(() => setError("Error al cargar las solicitudes"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-status">Cargando solicitudes...</div>;
  if (error) return <div className="page-status page-error">{error}</div>;
  if (requests.length === 0)
    return (
      <div className="page-status">
        <p>No hay solicitudes registradas.</p>
        <Link to="/requests/create" className="btn-primary">
          Crear primera solicitud
        </Link>
      </div>
    );

  return (
    <div className="requests-list-page">
      <div className="page-header">
        <h2>Solicitudes de Compra</h2>
        <Link to="/requests/create" className="btn-primary">
          Nueva Solicitud
        </Link>
      </div>
      <div className="requests-grid">
        {requests.map((req) => (
          <RequestCard key={req.id} request={req} />
        ))}
      </div>
    </div>
  );
};

export default RequestsListPage;
