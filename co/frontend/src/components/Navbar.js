import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiX, FiLogOut, FiUser, FiFileText } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600 hover:text-primary-700 transition">
            <FiFileText className="text-2xl" />
            <span>AI Resume Builder</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-primary-600 font-medium transition">
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {user.picture ? (
                      <img src={user.picture} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <FiUser className="text-xl text-slate-400" />
                    )}
                    <span className="text-sm font-medium text-slate-700">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-red-500 transition"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-primary-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-700 transition"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-2xl text-slate-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-fade-in">
          <div className="px-4 py-3 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  {user.picture ? (
                    <img src={user.picture} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <FiUser className="text-xl text-slate-400" />
                  )}
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block text-slate-600 hover:text-primary-600 font-medium"
                >
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-red-500 font-medium">
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block bg-primary-600 text-white text-center px-5 py-2 rounded-lg font-medium"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
