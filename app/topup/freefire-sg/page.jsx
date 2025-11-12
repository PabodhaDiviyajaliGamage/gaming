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
    <div className="min-h-screen bg-blue-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-300">
            ← SL Gaming Hub
          </Link>
          {!isLoggedIn && (
            <Link href="/auth/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">
              Login
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Game Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-8 mb-8 text-center">
          <div className="text-7xl mb-4">🔥</div>
          <h1 className="text-4xl font-bold mb-2">Free Fire SG Top Up</h1>
          <p className="text-lg">Get your diamonds instantly!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Game ID Input */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4 text-yellow-400">Enter Game Info</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Free Fire ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your Free Fire ID"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Find your ID in-game profile
                </p>
              </div>

              {selectedPackage && (
                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <h3 className="font-bold text-yellow-400 mb-2">Selected Package:</h3>
                  <p className="text-2xl font-bold">💎 {selectedPackage.diamonds} Diamonds</p>
                  {selectedPackage.bonus > 0 && (
                    <p className="text-green-400 text-sm">+{selectedPackage.bonus} Bonus!</p>
                  )}
                  <p className="text-xl text-yellow-400 mt-2">{selectedPackage.price}</p>
                </div>
              )}

              <button
                onClick={handlePurchase}
                className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!gameId || !selectedPackage}
              >
                {!isLoggedIn ? 'Login to Purchase' : 'Proceed to Payment'}
              </button>

              <div className="mt-4 bg-blue-900 bg-opacity-50 rounded-lg p-3">
                <p className="text-xs text-gray-300">
                  💡 Tip: Make sure your Free Fire ID is correct before purchasing!
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Packages */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-yellow-400">Select Package</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`relative bg-gray-800 border-2 rounded-lg p-6 cursor-pointer transition ${
                    selectedPackage?.id === pkg.id
                      ? 'border-yellow-400 shadow-lg shadow-yellow-400/50'
                      : pkg.popular
                      ? 'border-yellow-500'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                      ⭐ MOST POPULAR
                    </div>
                  )}

                  <div className="text-center">
                    <div className="text-5xl mb-3">💎</div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {pkg.diamonds} Diamonds
                    </h3>
                    {pkg.bonus > 0 && (
                      <p className="text-green-400 text-sm font-semibold mb-2">
                        +{pkg.bonus} Bonus Diamonds!
                      </p>
                    )}
                    <p className="text-3xl font-bold text-yellow-400 mb-4">
                      {pkg.price}
                    </p>
                    <div className={`px-4 py-2 rounded-lg font-semibold ${
                      selectedPackage?.id === pkg.id
                        ? 'bg-yellow-500 text-black'
                        : 'bg-gray-700 text-white'
                    }`}>
                      {selectedPackage?.id === pkg.id ? '✓ Selected' : 'Select'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6">
              <h3 className="text-lg font-bold text-yellow-300 mb-4">📋 How to Top Up:</h3>
              <ol className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 font-bold">1.</span>
                  <span>Enter your Free Fire ID (found in your game profile)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 font-bold">2.</span>
                  <span>Select your desired diamonds package</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 font-bold">3.</span>
                  <span>Complete payment via eZcash (0773043667 / 0741880764)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 font-bold">4.</span>
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
