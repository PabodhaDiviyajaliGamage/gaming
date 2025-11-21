// app/admin/layout.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function AdminLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const role = localStorage.getItem("userRole");
      const name = localStorage.getItem("userName");
      const token = localStorage.getItem("token");

      // Basic local check
      if (!loggedIn || role !== "admin" || !token) {
        redirectToLogin("Access denied! Admin login required.");
        return;
      }

      try {
        // Validate token with backend
        await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserName(name || "Admin");
        setIsAuthorized(true);
      } catch (err) {
        redirectToLogin("Session expired. Please login again.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const redirectToLogin = (msg) => {
    setIsAuthorized(false);
    localStorage.clear();
    alert(msg);
    router.push("/auth/login");
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthorized(false);
    router.push("/");
  };

  // Loading screen
  if (isLoading)
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center text-slate-800">
        Loading...
      </div>
    );

  // Prevent flicker
  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="flex">
        <aside className="w-64 bg-blue-50 min-h-screen p-4 border-r border-blue-200 shadow-sm">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/sl-gaming-hub-logo.svg" 
                alt="SL Gaming Hub Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h2 className="text-slate-800 text-xl font-bold">Admin Panel</h2>
              </div>
            </div>
            <p className="text-slate-600 text-sm">{userName}</p>
          </div>

          <nav className="space-y-2">
            <Link
              href="/admin/orders"
              className="block text-slate-700 hover:bg-blue-50 hover:text-blue-700 p-3 rounded transition"
            >
              📦 Orders
            </Link>

            <Link
              href="/admin/games"
              className="block text-slate-700 hover:bg-blue-50 hover:text-blue-700 p-3 rounded transition"
            >
              🎮 Games
            </Link>

            <Link
              href="/admin/packages"
              className="block text-slate-700 hover:bg-blue-50 hover:text-blue-700 p-3 rounded transition"
            >
              📦 Packages
            </Link>

            <Link
              href="/admin/users"
              className="block text-slate-700 hover:bg-blue-50 hover:text-blue-700 p-3 rounded transition"
            >
              👥 Users
            </Link>

            <Link
              href="/admin/bank-details"
              className="block text-slate-700 hover:bg-blue-50 hover:text-blue-700 p-3 rounded transition"
            >
              🏦 Bank Details
            </Link>

            <Link
              href="/admin/banner"
              className="block text-slate-700 hover:bg-blue-50 hover:text-blue-700 p-3 rounded transition"
            >
              🖼️ Header Banner
            </Link>

            <hr className="border-slate-300 my-4" />

            <Link
              href="/"
              className="block text-blue-600 hover:bg-blue-50 p-3 rounded transition"
            >
              🏠 Back to Home
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left text-red-600 hover:bg-red-50 p-3 rounded transition"
            >
              🚪 Logout
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8 bg-blue-50">{children}</main>
      </div>
    </div>
  );
}
