import React, { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { IconShield, IconClock, IconInfo } from "../components/ui/Icons";

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
    <div className="max-w-md mx-auto mt-8">
      <Card>
        <div className="text-center space-y-4">
          <div className="mx-auto w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center">
            <IconShield size={28} className="text-primary-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">Validación OTP</h2>
            <p className="text-sm text-gray-500 mt-1">
              Se ha enviado un código OTP al correo del aprobador.
            </p>
          </div>

          {expiresAt && (
            <div className="flex items-center justify-center gap-1.5 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
              <IconClock size={14} />
              <span>Expira: {new Date(expiresAt).toLocaleTimeString("es-ES")}</span>
            </div>
          )}

          {mockCode && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
              <p className="text-xs text-emerald-600 font-medium mb-1">Código de prueba</p>
              <p className="text-2xl font-bold text-emerald-700 tracking-[0.3em]">{mockCode}</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200">
              <IconInfo size={14} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Código OTP</label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="block w-full text-center text-2xl tracking-[0.5em] rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-300 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
                autoFocus
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={otp.length !== 6}
              className="w-full"
              size="lg"
            >
              {loading ? "Validando..." : "Validar OTP"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default OtpForm;
