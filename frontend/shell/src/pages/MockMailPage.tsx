import React, { useEffect, useState, useCallback } from "react";
import { mockMailService, type MockEmail } from "../services/mockMail.service";

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

  if (loading && emails.length === 0)
    return <div className="page-status">Cargando bandeja de correos...</div>;
  if (error && emails.length === 0)
    return <div className="page-status page-error">{error}</div>;

  return (
    <div className="mock-mail-page">
      <div className="page-header">
        <h2>Bandeja de aprobaciones</h2>
        <button className="btn-primary" onClick={fetchEmails} disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {emails.length === 0 ? (
        <div className="page-status">
          <p>No hay solicitudes pendientes de aprobación.</p>
          <p>Crea una solicitud desde "Solicitudes" para ver los correos aquí.</p>
        </div>
      ) : (
        <div className="emails-list">
          {[...emails].reverse().map((email, idx) => (
            <div key={idx} className="email-card">
              <div className="email-header">
                <span className="email-to">{email.to}</span>
                <span className="email-date">{formatDate(email.sentAt)}</span>
              </div>
              <h4 className="email-subject">{email.subject}</h4>
              <p className="email-body-preview">{truncate(email.body.trim(), 200)}</p>
              <div className="email-actions">
                <a
                  href={email.url}
                  className="btn-approve"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ir a aprobar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MockMailPage;
