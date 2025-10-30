import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";


function Protected() {
const { user, loading } = useAuth();
if (loading) return <div>Loading...</div>;
if (!user) return <Login />;
return <Dashboard />;
}


export default function App() {
return (
<AuthProvider>
<BrowserRouter>
<Routes>
<Route path="/*" element={<Protected />} />
</Routes>
</BrowserRouter>
</AuthProvider>
);
}
