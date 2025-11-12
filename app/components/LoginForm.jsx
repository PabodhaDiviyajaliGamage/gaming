'use client'

import { useState } from 'react'

export default function LoginForm({ onClose, onShowRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please fill in both fields')
      return
    }

    setLoading(true)
    setError('')

    // Simulate login with mock data (replace with real API later)
    setTimeout(() => {
      // Check hardcoded test accounts first
      if (email === 'admin@mail.com' && password === 'admin@123') {
        localStorage.setItem('userRole', 'admin')
        localStorage.setItem('userName', 'Admin User')
        localStorage.setItem('userEmail', email)
        localStorage.setItem('isLoggedIn', 'true')
        alert('Admin login successful!')
        window.location.href = '/admin/orders'
        return
      } else if (email === 'user@mail.com' && password === 'user@123') {
        localStorage.setItem('userRole', 'user')
        localStorage.setItem('userName', 'Regular User')
        localStorage.setItem('userEmail', email)
        localStorage.setItem('isLoggedIn', 'true')
        alert('Login successful!')
        window.location.href = '/'
        return
      }

      // Check registered users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => u.email === email && u.password === password)
      
      if (user) {
        localStorage.setItem('userRole', user.role || 'user')
        localStorage.setItem('userName', user.name)
        localStorage.setItem('userEmail', user.email)
        localStorage.setItem('isLoggedIn', 'true')
        alert('Login successful!')
        window.location.href = '/'
      } else {
        setError('Invalid email or password')
      }
      
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="max-w-md w-full mx-auto bg-gray-900 bg-opacity-90 text-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-300">Welcome to</h2>
        <h1 className="text-2xl font-bold text-orange-400">SL Gaming Hub</h1>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
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
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁'}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold disabled:opacity-50 transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          {onClose && (
            <button
              type="button"
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition"
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
      </form>

      {/* Links */}
      <div className="text-center space-y-2 mt-4">
        <button
          type="button"
          className="text-blue-400 hover:underline text-sm block w-full"
          onClick={() => alert('Password reset feature coming soon!')}
        >
          Forgot password?
        </button>
        <div className="text-gray-400 text-sm">
          Don&apos;t have an account?{' '}
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
  )
}
