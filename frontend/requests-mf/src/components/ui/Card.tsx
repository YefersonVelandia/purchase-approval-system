import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = "", padding = true }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-corporate ${padding ? "p-6" : ""} ${className}`}>
    {children}
  </div>
);

interface CardHeaderProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = "", title, action }) => (
  <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 ${className}`}>
    {title ? (
      <>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </>
    ) : (
      children
    )}
  </div>
);

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export default Card;
