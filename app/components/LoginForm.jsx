// app/components/LoginForm.jsx
"use client";
import { useState } from "react";
import axios from "axios";

export default function LoginForm({ onClose, onShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/login", { email, password });

      if (res.data.success) {
        // Save only safe data to localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", res.data.user.name);
        localStorage.setItem("userRole", res.data.user.role);
        localStorage.setItem("userEmail", res.data.user.email);
        localStorage.setItem("token", res.data.token); // Save token for API calls

        alert("Login successful!");
        window.location.href =
          res.data.user.role === "admin" ? "/admin/orders" : "/";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-gray-900 bg-opacity-90 text-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-300">Welcome to</h2>
        <h1 className="text-2xl font-bold text-orange-400">SL Gaming Hub</h1>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold disabled:opacity-50 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition"
            >
              Close
            </button>
          )}
        </div>
      </form>

      <div className="text-center space-y-2 mt-4">
        <button
          type="button"
          onClick={() => alert("Contact admin to reset password")}
          className="text-blue-400 hover:underline text-sm"
        >
          Forgot password?
        </button>
        <div className="text-gray-400 text-sm">
          Don`&apos;`t have an account?{" "}
          {onShowRegister ? (
            <button
              onClick={onShowRegister}
              className="text-blue-400 hover:underline"
            >
              Register
            </button>
          ) : (
            <a href="/auth/register" className="text-blue-400 hover:underline">
              Register
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
