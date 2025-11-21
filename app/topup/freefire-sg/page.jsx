'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function TopUpFreeFirSGPage() {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [gameId, setGameId] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)
  }, [])

  const packages = [
    { id: 1, diamonds: 100, price: 'LKR 200', bonus: 0 },
    { id: 2, diamonds: 310, price: 'LKR 500', bonus: 31, popular: true },
    { id: 3, diamonds: 520, price: 'LKR 1,000', bonus: 52 },
    { id: 4, diamonds: 1060, price: 'LKR 2,000', bonus: 106 },
    { id: 5, diamonds: 2180, price: 'LKR 4,000', bonus: 218 },
    { id: 6, diamonds: 5600, price: 'LKR 10,000', bonus: 560 },
  ]

  const handlePurchase = () => {
    if (!isLoggedIn) {
      alert('Please login first!')
      window.location.href = '/auth/login'
      return
    }

    if (!gameId) {
      alert('Please enter your Free Fire ID!')
      return
    }

    if (!selectedPackage) {
      alert('Please select a package!')
      return
    }

    alert(`Purchase initiated!\n\nGame ID: ${gameId}\nPackage: ${selectedPackage.diamonds} Diamonds\nPrice: ${selectedPackage.price}\n\nCheckout feature coming soon!`)
  }

  return (
    <div className="min-h-screen bg-blue-50 text-slate-800">
      {/* Header */}
      <header className="bg-blue-50 p-4 border-b border-blue-200 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-blue-600 hover:text-blue-500 transition-colors">
            <img 
              src="/sl-gaming-hub-logo.svg" 
              alt="SL Gaming Hub Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-bold">SL Gaming Hub</span>
          </Link>
          {!isLoggedIn && (
            <Link href="/auth/login" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition text-white">
              Login
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Game Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 mb-8 text-center text-white">
          <div className="text-7xl mb-4">🔥</div>
          <h1 className="text-4xl font-bold mb-2">Free Fire SG Top Up</h1>
          <p className="text-lg">Get your diamonds instantly!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Game ID Input */}
          <div className="lg:col-span-1">
            <div className="bg-blue-100 rounded-lg p-6 sticky top-6 border border-blue-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-blue-600">Enter Game Info</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Free Fire ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your Free Fire ID"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-blue-200 text-slate-800 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Find your ID in-game profile
                </p>
              </div>

              {selectedPackage && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-bold text-blue-700 mb-2">Selected Package:</h3>
                  <p className="text-2xl font-bold text-slate-800">💎 {selectedPackage.diamonds} Diamonds</p>
                  {selectedPackage.bonus > 0 && (
                    <p className="text-green-600 text-sm">+{selectedPackage.bonus} Bonus!</p>
                  )}
                  <p className="text-xl text-blue-600 mt-2">{selectedPackage.price}</p>
                </div>
              )}

              <button
                onClick={handlePurchase}
                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!gameId || !selectedPackage}
              >
                {!isLoggedIn ? 'Login to Purchase' : 'Proceed to Payment'}
              </button>

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-slate-600">
                  💡 Tip: Make sure your Free Fire ID is correct before purchasing!
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Packages */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Select Package</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative bg-blue-100 border-2 rounded-lg p-6 cursor-pointer transition shadow-sm hover:shadow-md ${
                    selectedPackage?.id === pkg.id
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                      : pkg.popular
                      ? 'border-yellow-500'
                      : 'border-blue-300 hover:border-blue-400'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                      ⭐ MOST POPULAR
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-5xl mb-3">💎</div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-1">
                      {pkg.diamonds} Diamonds
                    </h3>
                    {pkg.bonus > 0 && (
                      <p className="text-green-600 text-sm font-semibold mb-2">
                        +{pkg.bonus} Bonus Diamonds!
                      </p>
                    )}
                    <p className="text-3xl font-bold text-blue-600 mb-4">
                      {pkg.price}
                    </p>
                    <div className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedPackage?.id === pkg.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}>
                      {selectedPackage?.id === pkg.id ? '✓ Selected' : 'Select'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-700 mb-4">📋 How to Top Up:</h3>
              <ol className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>Enter your Free Fire ID (found in your game profile)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>Select your desired diamonds package</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>Complete payment via eZcash (0773043667 / 0741880764)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>Diamonds will be credited within 5-10 minutes!</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
