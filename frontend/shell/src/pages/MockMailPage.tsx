import React, { useEffect, useState, useCallback } from "react";
import { mockMailService, type MockEmail } from "../services/mockMail.service";
import Card, { CardHeader } from "../components/ui/Card";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import { LoadingScreen } from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";
import { IconMail, IconRefresh, IconExternalLink, IconClock } from "../components/ui/Icons";

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const truncate = (text: string, max: number): string =>
  text.length > max ? text.slice(0, max) + "..." : text;

const MockMailPage: React.FC = () => {
  const [emails, setEmails] = useState<MockEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(() => {
    setLoading(true);
    setError(null);
    mockMailService
      .list()
      .then(setEmails)
      .catch(() => setError("Error al cargar la bandeja de correos"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  if (loading && emails.length === 0) return <LoadingScreen message="Cargando bandeja de correos..." />;
  if (error && emails.length === 0) return <ErrorState message={error} onRetry={fetchEmails} />;

  const reversedEmails = [...emails].reverse();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Bandeja de aprobaciones</h1>
          <p className="text-sm text-gray-500 mt-1">
            {emails.length} correo{emails.length !== 1 ? "s" : ""} pendiente{emails.length !== 1 ? "s" : ""} de aprobación
          </p>
        </div>
        <Button variant="secondary" onClick={fetchEmails} loading={loading}>
          <IconRefresh size={16} />
          {loading ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      {emails.length === 0 ? (
        <Card>
          <EmptyState
            icon={<IconMail size={48} />}
            title="No hay solicitudes pendientes"
            description='Crea una solicitud desde "Solicitudes" para ver los correos aquí.'
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {reversedEmails.map((email, idx) => (
            <Card key={idx} className="hover:shadow-corporate-lg transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="pending">Pendiente</Badge>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <IconClock size={12} />
                      {formatDate(email.sentAt)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-primary-600 mb-0.5">{email.to}</p>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{email.subject}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{truncate(email.body.trim(), 250)}</p>
                </div>
                <a
                  href={email.url}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap flex-shrink-0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconExternalLink size={14} />
                  Ir a aprobar
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MockMailPage;
