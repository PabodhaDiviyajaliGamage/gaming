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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );

  // Prevent flicker
  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        <aside className="w-64 bg-gray-800 min-h-screen p-4">
          <div className="mb-6">
            <h2 className="text-white text-xl font-bold mb-2">Admin Panel</h2>
            <p className="text-gray-400 text-sm">{userName}</p>
          </div>

          <nav className="space-y-2">
            <Link
              href="/admin/orders"
              className="block text-white hover:bg-gray-700 p-3 rounded transition"
            >
              📦 Orders
            </Link>

            <Link
              href="/admin/games"
              className="block text-white hover:bg-gray-700 p-3 rounded transition"
            >
              🎮 Games
            </Link>

            <Link
              href="/admin/packages"
              className="block text-white hover:bg-gray-700 p-3 rounded transition"
            >
              📦 Packages
            </Link>

            <Link
              href="/admin/users"
              className="block text-white hover:bg-gray-700 p-3 rounded transition"
            >
              👥 Users
            </Link>

            <Link
              href="/admin/bank-details"
              className="block text-white hover:bg-gray-700 p-3 rounded transition"
            >
              🏦 Bank Details
            </Link>

            <Link
              href="/admin/banner"
              className="block text-white hover:bg-gray-700 p-3 rounded transition"
            >
              🖼️ Header Banner
            </Link>

            <hr className="border-gray-700 my-4" />

            <Link
              href="/"
              className="block text-blue-400 hover:bg-gray-700 p-3 rounded transition"
            >
              🏠 Back to Home
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left text-red-400 hover:bg-gray-700 p-3 rounded transition"
            >
              🚪 Logout
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
