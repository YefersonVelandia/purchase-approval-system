import React from "react";
import { IconAlertTriangle } from "./Icons";
import Button from "./Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="mb-4 text-red-400">
      <IconAlertTriangle size={40} />
    </div>
    <h3 className="text-base font-semibold text-gray-900 mb-1">Error</h3>
    <p className="text-sm text-gray-500 mb-4 max-w-sm">{message}</p>
    {onRetry && (
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Intentar nuevamente
      </Button>
    )}
  </div>
);

export default ErrorState;
