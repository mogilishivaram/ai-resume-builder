import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { FiFileText } from "react-icons/fi";

export default function Login() {
  const { user } = useAuth();

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-primary-50 px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiFileText className="text-3xl text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
            <p className="text-slate-500 mt-1">Sign in to continue building your resume</p>
          </div>

          {/* Google Login */}
          <GoogleLoginButton />

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">Secure authentication</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Info */}
          <div className="text-center text-xs text-slate-400 space-y-2">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
            <p>Your data is encrypted and securely stored.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
