'use client'

import { useState } from 'react'

export default function RegisterForm({ onClose, onShowLogin }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Please fill all required fields!')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters!')
      return
    }

    setLoading(true)
    setError('')

    // Simulate registration (replace with real API later)
    setTimeout(() => {
      // Mock registration - save to localStorage for demo
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === formData.email)
      if (existingUser) {
        setError('User with this email already exists!')
        setLoading(false)
        return
      }

      // Add new user
      users.push({
        id: Date.now(),
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        password: formData.password, // In real app, this should be hashed!
        role: 'user',
        createdAt: new Date().toISOString()
      })

      localStorage.setItem('users', JSON.stringify(users))
      
      setSuccess(true)
      alert('Registration successful! You can now login with your credentials.')
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
      })

      // Show login form after 2 seconds
      setTimeout(() => {
        if (onShowLogin) {
          onShowLogin()
        } else {
          window.location.href = '/'
        }
      }, 2000)

      setLoading(false)
    }, 1500)
  }

  if (success) {
    return (
      <div className="max-w-md w-full mx-auto bg-gray-900 bg-opacity-90 text-white rounded-xl shadow-lg p-6">
        <div className="text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h2 className="text-2xl font-bold text-green-400">Registration Successful!</h2>
          <p className="text-gray-300">You can now login with your credentials.</p>
          <button
            onClick={onShowLogin || (() => window.location.href = '/')}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md w-full mx-auto bg-gray-900 bg-opacity-90 text-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-300">Welcome to</h2>
        <h1 className="text-2xl font-bold text-orange-400">SL Gaming Hub</h1>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password (min 6 characters)"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
              minLength={6}
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <span
              className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-white"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? '🙈' : '👁'}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold disabled:opacity-50 transition"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          {onClose && (
            <button
              type="button"
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>
          )}
        </div>
      </form>

      {/* Links */}
      <div className="text-center space-y-2 mt-4">
        <div className="text-gray-400 text-sm">
          Already have an account?{' '}
          {onShowLogin ? (
            <button
              type="button"
              onClick={onShowLogin}
              className="text-blue-400 hover:underline"
            >
              Login
            </button>
          ) : (
            <a href="/" className="text-blue-400 hover:underline">
              Login
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
