import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import ResumeEditor from "./pages/ResumeEditor";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/login" />;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500">Loading…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />
        <Route
          path="/resume/:id"
          element={<PrivateRoute><ResumeEditor /></PrivateRoute>}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
