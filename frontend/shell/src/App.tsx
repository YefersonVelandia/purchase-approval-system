import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const RequestsApp = React.lazy(() => import("requests-mf/RequestsApp"));
const ApprovalsApp = React.lazy(() => import("approvals-mf/ApprovalsApp"));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/requests">Requests</Link></li>
          <li><Link to="/approvals">Approvals</Link></li>
        </ul>
      </nav>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<h1>Welcome to Purchase Approval System</h1>} />
          <Route path="/requests/*" element={<RequestsApp />} />
          <Route path="/approvals/*" element={<ApprovalsApp />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default App;
