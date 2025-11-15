import React, { useState } from "react";
import axios from "axios";
import { decodeToken, login } from "../../utils/authUtils";
import { getApiUrl, getApiHeaders } from "../../utils/apiUtils";
import { API_CONFIG } from "../../config/apiConfig";

export default function LoginForm({ onClose, onShowRegister, onShowReset }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Safe close function that checks if onClose is provided
  const safeClose = () => {
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const loginData = {
        email,
        password,
      };
      
      console.log("Attempting login with:", loginData);

      // Call the auth/login API endpoint
      const res = await axios.post(getApiUrl("/api/auth/login"), loginData);

      console.log("Login response:", res.data);
      
      if (!res.data.success || !res.data.token) {
        throw new Error(res.data.message || "Login failed");
      }
      
      console.log("Token received:", res.data.token.substring(0, 20) + "...");
      
      // Extract user data from response
      const userData = res.data.user || {};
      const userRole = userData.role || "user";
      const isAdmin = userRole === "admin";
      const userName = userData.name || "";
      
      // Store user data in userData object for login utility
      const userDataToStore = {
        role: userRole,
        name: userName,
        email: userData.email,
        userId: userData.userId,
        phone: userData.phone
      };
      
      // Use the login utility to store token and user data and trigger auth event
      login(res.data.token, userDataToStore);
      
      // Check if user is admin and redirect accordingly
      if (isAdmin) {
        alert("Admin login successful!");
        safeClose();
        
        // Redirect to admin panel
        window.location.href = "/admin/Order";
      } else {
        alert("Login successful!");
        safeClose();
        
        // Redirect to home
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Login error:", err);
      
      // Detailed error logging
      if (err.response) {
        // The request was made and the server responded with a status code
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        setError(err.response.data?.message || err.response.data?.error || `Invalid email or password`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        setError("Cannot connect to server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", err.message);
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isPopup = typeof onClose === 'function';

  return (
    <div className="max-w-md w-full mx-auto bg-gray-900 bg-opacity-90 text-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-300">Welcome to</h2>
        <h1 className="text-2xl font-bold text-orange-400">SL Gaming Hub</h1>
      </div>

      {/* Login Form Section */}
      <div className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Phone Number or Email <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Phone number or Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Action Buttons */}
        <div className={isPopup ? "flex justify-between gap-3" : ""}>
          <button
            className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold disabled:opacity-50"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          
          {isPopup && (
            <button
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold"
              onClick={safeClose}
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="text-center space-y-2 mt-4">
        {onShowReset ? (
          <button
            type="button"
            onClick={onShowReset}
            className="text-blue-400 hover:underline text-sm block w-full"
          >
            Forgot password?
          </button>
        ) : (
          <a href="/auth/reset" className="text-blue-400 hover:underline text-sm block">
            Forgot password?
          </a>
        )}
        <div className="text-gray-400 text-sm">
          Don&apos;t have an account?{" "}
          {onShowRegister ? (
            <button
              type="button"
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
