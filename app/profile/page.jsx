"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // "profile" or "orders"

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          router.push("/");
          return;
        }

        const response = await axios.get("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setProfileData(response.data);
        } else {
          setError("Failed to load profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          localStorage.removeItem("userRole");
          router.push("/");
        } else {
          setError(err.response?.data?.message || "Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    router.push("/");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      processing: "bg-blue-100 text-blue-800 border-blue-300",
      completed: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return statusConfig[status] || statusConfig.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link
            href="/"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-colors inline-block"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/sl-gaming-hub-logo.svg"
              alt="SL Gaming Hub Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-bold text-slate-800">
              SL Gaming Hub
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {profileData?.user.role === "admin" && (
              <Link
                href="/admin/orders"
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-bold text-white transition-colors"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-bold text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {profileData?.user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  {profileData?.user.name}
                </h1>
                <p className="text-slate-600 mb-1">
                  📧 {profileData?.user.email}
                </p>
                <p className="text-sm text-slate-500">
                  Member since {formatDate(profileData?.user.createdAt)}
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      profileData?.user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {profileData?.user.role === "admin" ? "🛡️ Admin" : "👤 User"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="text-sm text-slate-600 mb-1">Total Orders</div>
            <div className="text-3xl font-bold text-slate-800">
              {profileData?.stats.totalOrders || 0}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="text-sm text-slate-600 mb-1">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">
              {profileData?.stats.pendingOrders || 0}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="text-sm text-slate-600 mb-1">Completed</div>
            <div className="text-3xl font-bold text-green-600">
              {profileData?.stats.completedOrders || 0}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="text-sm text-slate-600 mb-1">Total Spent</div>
            <div className="text-2xl font-bold text-purple-600">
              Rs. {profileData?.stats.totalSpent?.toFixed(2) || "0.00"}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "profile"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              👤 Profile Details
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === "orders"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              📦 Order History ({profileData?.orders.length || 0})
            </button>
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-slate-600 block mb-1">
                    User ID
                  </label>
                  <p className="text-slate-800 font-mono text-sm">
                    {profileData?.user.id}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-slate-600 block mb-1">
                    Full Name
                  </label>
                  <p className="text-slate-800 text-lg">
                    {profileData?.user.name}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-slate-600 block mb-1">
                    Email Address
                  </label>
                  <p className="text-slate-800">{profileData?.user.email}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-slate-600 block mb-1">
                    Account Type
                  </label>
                  <p className="text-slate-800 capitalize">
                    {profileData?.user.role}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <label className="text-sm font-semibold text-slate-600 block mb-1">
                    Member Since
                  </label>
                  <p className="text-slate-800">
                    {formatDate(profileData?.user.createdAt)}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                {profileData?.orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      No orders yet
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Start by making your first top-up order!
                    </p>
                    <Link
                      href="/"
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-colors inline-block"
                    >
                      Browse Games
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profileData?.orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-slate-50 rounded-lg p-5 border border-slate-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-1">
                              {order.gameName}
                            </h3>
                            <p className="text-slate-600 text-sm">
                              Order #{order.orderNumber}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-slate-500">Package</p>
                            <p className="text-slate-800 font-medium">
                              {order.packageName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Price</p>
                            <p className="text-slate-800 font-bold text-lg">
                              {order.packagePrice}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Player ID</p>
                            <p className="text-slate-800 font-mono text-sm">
                              {order.playerId}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">
                              Payment Method
                            </p>
                            <p className="text-slate-800 capitalize">
                              {order.paymentMethod}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-300">
                          <p className="text-xs text-slate-500">
                            Ordered on {formatDate(order.createdAt)}
                          </p>
                          {order.updatedAt !== order.createdAt && (
                            <p className="text-xs text-slate-500">
                              Updated {formatDate(order.updatedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
