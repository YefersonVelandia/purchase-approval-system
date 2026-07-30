import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Button from "./ui/Button";
import {
  IconHome,
  IconShoppingCart,
  IconMail,
  IconShield,
  IconBell,
  IconLogOut,
  IconMenu,
  IconChevronLeft,
} from "./ui/Icons";
import { mockMailService, type MockEmail } from "../services/mockMail.service";
import Input from "./ui/Input";

const navItems = [
  { path: "/", label: "Dashboard", icon: IconHome },
  { path: "/requests", label: "Solicitudes", icon: IconShoppingCart },
  { path: "/approvals/inbox", label: "Bandeja", icon: IconMail },
];

const Layout: React.FC = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifEmails, setNotifEmails] = useState<MockEmail[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mockMailService
      .list()
      .then(setNotifEmails)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const formatNotifDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const min = Math.floor(diff / 60000);
    if (min < 60) return `hace ${min}m`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `hace ${hrs}h`;
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-corporate-navy transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "w-[68px]" : "w-[260px]"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div
          className={`flex items-center h-16 px-4 border-b border-gray-800/50 ${sidebarCollapsed ? "justify-center" : "gap-3"}`}
        >
          <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <IconShield size={16} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-white truncate">PurchaseFlow</h1>
              <p className="text-[10px] text-gray-500 truncate">Sistema de Compras</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                isActive(item.path)
                  ? "bg-primary-600/15 text-primary-300"
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon size={20} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className={`p-3 border-t border-gray-800/50 ${sidebarCollapsed ? "text-center" : ""}`}>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800/50"
          >
            <IconLogOut size={20} />
            {!sidebarCollapsed && <span>Cerrar sesión</span>}
          </Button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-corporate">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <IconMenu size={20} />
              </button>

              {/* Sidebar toggle */}
              <Button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} variant="ghost">
                <IconChevronLeft
                  size={18}
                  className={`transition-transform duration-200 ${sidebarCollapsed ? "rotate-180" : ""}`}
                />
              </Button>

              {/* Breadcrumb / Search */}
              <div className="hidden sm:flex relative">
                <Input
                  type="text"
                  placeholder="Buscar solicitudes, aprobaciones..."
                  className="w-64 lg:w-80 pl-10 pr-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 placeholder-gray-400 focus:bg-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-colors duration-150"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                >
                  <IconBell size={20} />
                  {notifEmails.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-corporate-lg border border-gray-200 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">Notificaciones</p>
                      <p className="text-xs text-gray-500">{notifEmails.length} pendientes</p>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                      {notifEmails.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                          No hay notificaciones
                        </div>
                      ) : (
                        [...notifEmails]
                          .reverse()
                          .slice(0, 5)
                          .map((email, idx) => (
                            <a
                              key={idx}
                              href={email.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-3 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-medium text-primary-600 truncate">
                                    {email.to}
                                  </p>
                                  <p className="text-sm text-gray-900 truncate mt-0.5">
                                    {email.subject}
                                  </p>
                                </div>
                                <span className="text-[10px] text-gray-400 whitespace-nowrap mt-0.5">
                                  {formatNotifDate(email.sentAt)}
                                </span>
                              </div>
                            </a>
                          ))
                      )}
                    </div>
                    <a
                      href="/approvals/inbox"
                      className="block px-4 py-2.5 text-center text-sm font-medium text-primary-600 hover:bg-primary-50 border-t border-gray-100 transition-colors"
                    >
                      Ver todas
                    </a>
                  </div>
                )}
              </div>

              {/* User */}
              <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-gray-200">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-700">Carlos Martínez</p>
                  <p className="text-xs text-gray-500">carlos@empresa.com</p>
                </div>
                <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  CM
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
