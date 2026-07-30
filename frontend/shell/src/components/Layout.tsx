import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../styles/global.css";

const Layout: React.FC = () => {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>Purchase Approval System</h1>
        <nav className="app-nav">
          <ul>
            <li>
              <Link to="/requests">Solicitudes</Link>
            </li>
            <li>
              <Link to="/approvals">Aprobaciones</Link>
            </li>
            <li>
              <Link to="/approvals/inbox">Bandeja</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
