import React from "react";
import { FcGoogle } from "react-icons/fc";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function GoogleLoginButton() {
  const handleLogin = () => {
    window.location.href = `${API_BASE}/auth/google/login`;
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center gap-3 w-full justify-center bg-white border-2 border-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl hover:border-primary-400 hover:shadow-md transition-all duration-200"
    >
      <FcGoogle className="text-2xl" />
      Continue with Google
    </button>
  );
}
