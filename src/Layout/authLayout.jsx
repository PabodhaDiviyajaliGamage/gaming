import React from 'react';
import { Outlet, Link } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="bg-blue-50 min-h-screen">
      {/* Header */}
      <header className="bg-blue-50 text-slate-800 shadow-md border-b border-blue-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/">
              <img
                src="/sl-gaming-hub-logo.svg"
                alt="SL Gaming Hub Logo"
                className="w-12 h-12 object-contain"
              />
            </Link>
            <span className="text-lg font-bold">SL Gaming Hub</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <Link to="/" className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition text-white">
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex items-center justify-center min-h-[calc(100vh-76px)] py-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
