import React, { useState } from "react";

interface OtpFormProps {
  onSubmit: (otpCode: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  expiresAt?: string | null;
  mockCode?: string | null;
}

const OtpForm: React.FC<OtpFormProps> = ({ onSubmit, loading, error, expiresAt, mockCode }) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(otp);
  };

  return (
    <div className="otp-container">
      <h2>Validación OTP</h2>
      <p className="otp-desc">
        Se ha enviado un código OTP al correo del aprobador.
        {expiresAt && (
          <span className="otp-expires">
            {" "}Expira: {new Date(expiresAt).toLocaleTimeString("es-ES")}
          </span>
        )}
      </p>

      {mockCode && (
        <div className="mock-otp-code">
          Código de prueba: <strong>{mockCode}</strong>
        </div>
      )}

      {error && <div className="form-error">{error}</div>}

      <form className="otp-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="otp">Código OTP</label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Ingresa el código de 6 dígitos"
            required
            autoFocus
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading || otp.length !== 6}>
          {loading ? "Validando..." : "Validar OTP"}
        </button>
      </form>
    </div>
  );
};

export default OtpForm;
