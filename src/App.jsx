// client/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import ServerDown from "./pages/ServerDown";
import ErrorBoundary from "./ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<div style={{ padding: 20 }}>Welcome — go to /dashboard</div>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/server-down" element={<ServerDown />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
