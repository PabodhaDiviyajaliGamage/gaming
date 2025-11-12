'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import { gamesAPI, packagesAPI, ordersAPI } from '@/lib/api'
import { defaultGames, defaultPackages } from './data/defaultData'

export default function HomePage() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showPlayerDetailsModal, setShowPlayerDetailsModal] = useState(false)
  const [showPackagesModal, setShowPackagesModal] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [packageQuantity, setPackageQuantity] = useState(1)
  const [packageQuantities, setPackageQuantities] = useState({})
  const [playerDetails, setPlayerDetails] = useState({ playerId: '', playerNickname: '' })
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentSlip, setPaymentSlip] = useState('')
  const [bannerImage, setBannerImage] = useState('')
  const [games, setGames] = useState([])
  const [packages, setPackages] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      // Check login status
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
      const name = localStorage.getItem('userName') || ''
      const role = localStorage.getItem('userRole') || ''
      const email = localStorage.getItem('userEmail') || ''
      const banner = localStorage.getItem('headerBanner') || ''
      
      setIsLoggedIn(loggedIn)
      setUserName(name)
      setUserRole(role)
      setUserEmail(email)
      setBannerImage(banner)
      
      // Load games from MongoDB
      try {
        const gamesResponse = await gamesAPI.getAll()
        const activeGames = (gamesResponse.data || []).filter(g => g.status === 'active')
        setGames(activeGames.length > 0 ? activeGames : defaultGames)
      } catch (error) {
        console.error('Error loading games:', error)
        setGames(defaultGames)
      }
      
      // Load packages from MongoDB
      try {
        const packagesResponse = await packagesAPI.getAll()
        const activePackages = (packagesResponse.data || []).filter(p => p.status === 'active')
        setPackages(activePackages.length > 0 ? activePackages : defaultPackages)
      } catch (error) {
        console.error('Error loading packages:', error)
        setPackages(defaultPackages)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTopUpClick = (game) => {
    setSelectedGame(game)
    setPackageQuantity(1)
    setPackageQuantities({})
    setShowPackagesModal(true)
  }

  const updatePackageQuantity = (pkgId, delta) => {
    setPackageQuantities(prev => {
      const current = prev[pkgId] || 1
      const newQty = Math.max(1, Math.min(99, current + delta))
      return { ...prev, [pkgId]: newQty }
    })
  }

  const handlePackageSelect = (pkg) => {
    if (!isLoggedIn) {
      setShowPackagesModal(false)
      setShowLoginModal(true)
      alert('Please login to continue with purchase')
    } else {
      setSelectedPackage(pkg)
      setPlayerDetails({ playerId: '', playerNickname: '' })
      setShowPackagesModal(false)
      setShowPlayerDetailsModal(true)
    }
  }

  const handlePlayerDetailsSubmit = (e) => {
    e.preventDefault()
    if (playerDetails.playerId.trim() && playerDetails.playerNickname.trim()) {
      setShowPlayerDetailsModal(false)
      setShowCheckoutModal(true)
    } else {
      alert('Please fill in both Player ID and Player Nickname')
    }
  }

  const handleCheckoutSubmit = (e) => {
    e.preventDefault()
    
    if (!paymentMethod) {
      alert('Please select a payment method')
      return
    }
    
    if (!paymentSlip) {
      alert('Please upload your payment slip')
      return
    }

    // Calculate total amount
    const unitPrice = parseInt(selectedPackage.price.replace(/[^0-9]/g, ''))
    const quantity = selectedPackage.quantity || 1
    const totalAmount = unitPrice * quantity

    // Create order
    const order = {
      id: Date.now(),
      orderNumber: 'ORD' + Date.now().toString().slice(-6),
      customerName: userName,
      game: selectedGame.name,
      package: selectedPackage.amount,
      quantity: quantity,
      amount: `LKR ${totalAmount}`,
      status: 'pending',
      gameId: playerDetails.playerId,
      playerNickname: playerDetails.playerNickname,
      paymentMethod: paymentMethod,
      paymentSlip: paymentSlip,
      createdAt: new Date().toISOString()
    }

    // Save to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]')
    existingOrders.push(order)
    localStorage.setItem('orders', JSON.stringify(existingOrders))

    // Prepare email content
    const orderDetails = 
      `Order Number: ${order.orderNumber}\n` +
      `Customer: ${order.customerName}\n` +
      `Game: ${order.game}\n` +
      `Package: ${order.package} x ${quantity}\n` +
      `Total Amount: LKR ${totalAmount}\n` +
      `Player ID: ${order.gameId}\n` +
      `Player Name: ${order.playerNickname}\n` +
      `Payment Method: ${paymentMethod === 'bank' ? 'Bank Transfer' : 'eZcash'}\n` +
      `Order Date: ${new Date().toLocaleString()}`

    // Email to admin
    const adminEmailSubject = encodeURIComponent(`New Order: ${order.orderNumber}`)
    const adminEmailBody = encodeURIComponent(
      `New Order Received!\n\n` +
      orderDetails +
      `\n\nPlease check the admin panel to view the payment slip and process the order.`
    )
    const adminMailtoUrl = `mailto:slgaminghub09@gmail.com?subject=${adminEmailSubject}&body=${adminEmailBody}`

    // Email to user (if email available)
    const userEmailSubject = encodeURIComponent(`Order Confirmation: ${order.orderNumber}`)
    const userEmailBody = encodeURIComponent(
      `Thank you for your order!\n\n` +
      `Your order has been placed successfully.\n\n` +
      orderDetails +
      `\n\nStatus: Pending\n\n` +
      `Your order is being processed. You will receive your ${quantity > 1 ? quantity + 'x ' : ''}${selectedPackage.amount} soon!\n\n` +
      `If you have any questions, please contact us.\n\n` +
      `Thank you for choosing SL Gaming Hub!`
    )
    const userMailtoUrl = userEmail ? 
      `mailto:${userEmail}?subject=${userEmailSubject}&body=${userEmailBody}` : null

    // Reset states
    setShowCheckoutModal(false)
    setPaymentMethod('')
    setPaymentSlip('')
    setSelectedPackage(null)
    setSelectedGame(null)
    
    alert(
      `Order placed successfully!\n\n` +
      `Order Number: ${order.orderNumber}\n\n` +
      `Your order is being processed. You will receive your ${quantity > 1 ? quantity + 'x ' : ''}${selectedPackage.amount} soon!`
    )

    // Open Email notifications
    window.open(adminMailtoUrl, '_blank')
    if (userMailtoUrl) {
      setTimeout(() => window.open(userMailtoUrl, '_blank'), 500)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    setIsLoggedIn(false)
    setUserName('')
    setUserRole('')
    alert('Logged out successfully!')
  }

  return (
    <div className="bg-blue-950 min-h-screen text-white">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-700 flex items-center justify-center">
              <span className="text-xl font-bold">SL</span>
            </div>
            <span className="text-lg font-bold">SL Gaming Hub</span>
          </div>
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                {userRole === 'admin' && (
                  <Link href="/admin/orders" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition">
                    Admin Panel
                  </Link>
                )}
                <span className="text-orange-400 font-medium mr-2">
                  Welcome, {userName}
                </span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                >
                  Login
                </button>
                <button 
                  onClick={() => setShowRegisterModal(true)}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <button
              className="absolute -top-2 -right-2 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center z-10 hover:bg-red-700"
              onClick={() => setShowLoginModal(false)}
            >
              ✕
            </button>
            <LoginForm 
              onClose={() => setShowLoginModal(false)}
              onShowRegister={() => {
                setShowLoginModal(false)
                setShowRegisterModal(true)
              }}
            />
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <button
              className="absolute -top-2 -right-2 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center z-10 hover:bg-red-700"
              onClick={() => setShowRegisterModal(false)}
            >
              ✕
            </button>
            <RegisterForm 
              onClose={() => setShowRegisterModal(false)}
              onShowLogin={() => {
                setShowRegisterModal(false)
                setShowLoginModal(true)
              }}
            />
          </div>
        </div>
      )}

      {/* Banner Section */}
      <div className="w-full overflow-hidden">
        {bannerImage ? (
          <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] relative">
            <img 
              src={bannerImage} 
              alt="Header Banner" 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] bg-gradient-to-r from-purple-900 to-blue-900 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-bold text-center">Welcome to SL Gaming Hub</h1>
          </div>
        )}
      </div>

      {/* Games Section */}
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-300">Featured Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.length === 0 ? (
            <div className="col-span-3 text-center text-gray-400 py-12">
              <p className="text-xl">No games available at the moment</p>
            </div>
          ) : (
            games.map((game) => {
              // Get packages for this game
              const gamePackages = packages.filter(pkg => pkg.game === game.name).map(pkg => ({
                id: pkg.id,
                amount: pkg.name,
                price: pkg.price,
                popular: pkg.popular || false
              }))
              
              return (
                <div key={game.id} className="bg-gray-800 rounded-lg p-6 text-center hover:shadow-xl transition">
                  {game.image ? (
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="w-24 h-24 mx-auto mb-4 object-contain rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextElementSibling.style.display = 'block'
                      }}
                    />
                  ) : null}
                  <div className="text-6xl mb-4" style={{display: game.image ? 'none' : 'block'}}>🎮</div>
                  <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                  <p className="text-gray-400 mb-4">{game.description}</p>
                  <button 
                    onClick={() => handleTopUpClick({ 
                      name: game.name, 
                      icon: game.image || '🎮',
                      packages: gamePackages.length > 0 ? gamePackages : [
                        { id: 1, amount: 'No packages available', price: 'N/A', popular: false }
                      ]
                    })}
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition"
                    disabled={gamePackages.length === 0}
                  >
                    {gamePackages.length > 0 ? 'Top Up Now' : 'No Packages'}
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Player Details Modal */}
      {showPlayerDetailsModal && selectedGame && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gray-800 p-6 border-b border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {typeof selectedGame.icon === 'string' && selectedGame.icon.startsWith('data:image') ? (
                  <img 
                    src={selectedGame.icon} 
                    alt={selectedGame.name}
                    className="w-12 h-12 object-contain rounded"
                  />
                ) : (
                  <span className="text-4xl">{selectedGame.icon}</span>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedGame.name}</h2>
                  <p className="text-gray-400">{selectedPackage.amount} x {selectedPackage.quantity || 1} - {selectedPackage.price}</p>
                </div>
              </div>
              <button
                className="text-white bg-red-600 hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center text-xl transition"
                onClick={() => setShowPlayerDetailsModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePlayerDetailsSubmit} className="p-6">
              <div className="space-y-4">
                <div className="bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-300">
                    ℹ️ Enter your game account details to receive {selectedPackage.quantity > 1 ? `${selectedPackage.quantity}x ` : ''}{selectedPackage.amount}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Player ID *
                  </label>
                  <input
                    type="text"
                    value={playerDetails.playerId}
                    onChange={(e) => setPlayerDetails({...playerDetails, playerId: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                    placeholder="Enter your player ID"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Your unique game ID (e.g., 123456789)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Player Nickname *
                  </label>
                  <input
                    type="text"
                    value={playerDetails.playerNickname}
                    onChange={(e) => setPlayerDetails({...playerDetails, playerNickname: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                    placeholder="Enter your in-game nickname"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Your in-game display name
                  </p>
                </div>

                <div className="bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg p-4">
                  <p className="text-sm text-blue-300">
                    ℹ️ Make sure your Player ID and Nickname are correct. This information will be used to process your top-up order.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition"
                >
                  Continue to Checkout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Packages Modal */}
      {showPackagesModal && selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 p-6 border-b border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {typeof selectedGame.icon === 'string' && selectedGame.icon.startsWith('data:image') ? (
                  <img 
                    src={selectedGame.icon} 
                    alt={selectedGame.name}
                    className="w-16 h-16 object-contain rounded"
                  />
                ) : (
                  <span className="text-5xl">{selectedGame.icon}</span>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedGame.name}</h2>
                  <p className="text-gray-400">Select a package to continue</p>
                </div>
              </div>
              <button
                className="text-white bg-red-600 hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center text-xl transition"
                onClick={() => setShowPackagesModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedGame.packages.map((pkg) => {
                  // Find the package from packages array to get the image
                  const packageData = packages.find(p => p.id === pkg.id)
                  const quantity = packageQuantities[pkg.id] || 1
                  
                  return (
                    <div 
                      key={pkg.id}
                      className={`relative bg-gray-800 border-2 ${pkg.popular ? 'border-yellow-500' : 'border-gray-700'} rounded-lg p-6 hover:border-yellow-400 transition`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                          POPULAR
                        </div>
                      )}
                      <div className="text-center">
                        {packageData?.image ? (
                          <img 
                            src={packageData.image} 
                            alt={pkg.amount}
                            className="w-16 h-16 mx-auto mb-3 object-contain rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextElementSibling.style.display = 'block'
                            }}
                          />
                        ) : null}
                        <div className="text-4xl mb-3" style={{display: packageData?.image ? 'none' : 'block'}}>💎</div>
                        <h3 className="text-xl font-bold text-white mb-2">{pkg.amount}</h3>
                        <p className="text-2xl font-bold text-yellow-400 mb-3">{pkg.price}</p>
                        
                        {/* Quantity Selector */}
                        <div className="mb-4">
                          <label className="block text-sm text-gray-400 mb-2">Quantity</label>
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                updatePackageQuantity(pkg.id, -1)
                              }}
                              className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition"
                            >
                              -
                            </button>
                            <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                updatePackageQuantity(pkg.id, 1)
                              }}
                              className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            setPackageQuantity(quantity)
                            handlePackageSelect({...pkg, quantity})
                          }}
                          className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition"
                        >
                          Select Package
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg p-4">
                <h3 className="text-lg font-bold text-yellow-300 mb-2">📋 How to Top Up:</h3>
                <ol className="text-sm text-gray-300 space-y-1 ml-4">
                  <li>1. Select your desired package above</li>
                  <li>2. {isLoggedIn ? 'Proceed to checkout' : 'Login to your account'}</li>
                  <li>3. Enter your game ID</li>
                  <li>4. Complete payment via eZcash</li>
                  <li>5. Receive your items within 5-10 minutes!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && selectedPackage && selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-800 p-6 border-b border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Checkout</h2>
                <p className="text-gray-400">Complete your payment</p>
              </div>
              <button
                className="text-white bg-red-600 hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center text-xl transition"
                onClick={() => setShowCheckoutModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="p-6">
              {/* Order Summary */}
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Game:</span>
                    <span className="text-white font-semibold">{selectedGame.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Package:</span>
                    <span className="text-white font-semibold">{selectedPackage.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quantity:</span>
                    <span className="text-white font-semibold">{selectedPackage.quantity || 1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Unit Price:</span>
                    <span className="text-white font-semibold">{selectedPackage.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Player ID:</span>
                    <span className="text-white font-semibold">{playerDetails.playerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Player Name:</span>
                    <span className="text-white font-semibold">{playerDetails.playerNickname}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between">
                    <span className="text-gray-400 font-bold">Total Amount:</span>
                    <span className="text-yellow-400 font-bold text-xl">
                      {(() => {
                        const price = parseInt(selectedPackage.price.replace(/[^0-9]/g, ''))
                        const qty = selectedPackage.quantity || 1
                        return `LKR ${price * qty}`
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Payment Method *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentMethod('bank')}
                    className={`cursor-pointer p-4 rounded-lg border-2 transition ${
                      paymentMethod === 'bank'
                        ? 'border-yellow-500 bg-yellow-500 bg-opacity-10'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">🏦</div>
                      <div className="font-semibold text-white">Bank Transfer</div>
                      <div className="text-xs text-gray-400 mt-1">Transfer to our bank</div>
                    </div>
                  </div>
                  <div
                    onClick={() => setPaymentMethod('ezcash')}
                    className={`cursor-pointer p-4 rounded-lg border-2 transition ${
                      paymentMethod === 'ezcash'
                        ? 'border-yellow-500 bg-yellow-500 bg-opacity-10'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">💳</div>
                      <div className="font-semibold text-white">eZcash</div>
                      <div className="text-xs text-gray-400 mt-1">Mobile payment</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              {paymentMethod && (
                <div className="mb-6 bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg p-4">
                  <h4 className="font-bold text-blue-300 mb-2">
                    {paymentMethod === 'bank' ? '🏦 Bank Transfer Details' : '💳 eZcash Payment Details'}
                  </h4>
                  {paymentMethod === 'bank' ? (
                    <div className="text-sm text-gray-300 space-y-1">
                      <p><strong>Bank:</strong> Bank of Ceylon</p>
                      <p><strong>Account Name:</strong> SL Gaming Hub</p>
                      <p><strong>Account Number:</strong> 1234567890</p>
                      <p><strong>Branch:</strong> Colombo Main</p>
                      <p className="text-yellow-300 mt-2">⚠️ Please upload your bank slip after payment</p>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-300 space-y-1">
                      <p><strong>eZcash Number:</strong> 0771234567</p>
                      <p><strong>Account Name:</strong> SL Gaming Hub</p>
                      <p className="text-yellow-300 mt-2">⚠️ Please upload your eZcash payment slip</p>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Slip Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Payment Slip * {paymentMethod === 'bank' ? '(Bank Slip)' : paymentMethod === 'ezcash' ? '(eZcash Slip)' : ''}
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setPaymentSlip(reader.result)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Upload a clear image of your payment slip (PNG, JPG)
                </p>
                {paymentSlip && (
                  <div className="mt-3 p-2 bg-gray-800 rounded border border-green-500">
                    <p className="text-xs text-green-400 mb-2">✓ Payment slip uploaded successfully</p>
                    <img 
                      src={paymentSlip} 
                      alt="Payment Slip" 
                      className="max-w-full h-32 object-contain rounded"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition text-lg"
              >
                Place Order
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                By placing this order, you agree to our terms and conditions. Your order will be processed within 5-10 minutes after payment verification.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Payment & Support Information */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-yellow-300">Payment & Support Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Store Hours */}
            <div className="border-b md:border-b-0 md:border-r border-blue-500 pb-6 md:pb-0 pr-0 md:pr-6">
              <h3 className="text-xl font-bold mb-4 text-yellow-300">Store Hours</h3>
              <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg">
                <p className="text-xl font-semibold mb-2">6:00 AM - 10:00 PM</p>
                <p className="text-sm text-blue-200">
                  We&apos;re open every day including weekends and holidays.
                </p>
              </div>
            </div>
            
            {/* eZcash Payment */}
            <div className="border-b md:border-b-0 md:border-r border-blue-500 pb-6 md:pb-0 px-0 md:px-6">
              <h3 className="text-xl font-bold mb-4 text-green-300">eZcash Payment</h3>
              <div className="bg-green-800 bg-opacity-40 p-4 rounded-lg">
                <p className="text-sm mb-3">Fast payment processing with eZcash!</p>
                <div className="bg-green-700 bg-opacity-30 p-2 rounded-lg mb-2">
                  <span className="font-mono text-green-100 font-bold">0773043667</span>
                </div>
                <div className="bg-green-700 bg-opacity-30 p-2 rounded-lg">
                  <span className="font-mono text-green-100 font-bold">0741880764</span>
                </div>
              </div>
            </div>
            
            {/* Customer Support */}
            <div className="pl-0 md:pl-6">
              <h3 className="text-xl font-bold mb-4 text-yellow-300">Customer Support</h3>
              <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg">
                <p className="text-sm mb-3">
                  ඔබ මිලදී ගත් Product එකේ යෝ Quantity වල ගැටලුවක් ඇත්නම් යෝ කෙළෙස් යෝ එක කොළඹවෙන් නම් අපගේ WhatsApp number එකට message එක එවීමෙන් Check කර ගත හැකිය.
                </p>
                <div className="bg-green-600 bg-opacity-40 p-3 rounded-lg mb-3 border border-green-500">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📱</span>
                    <a 
                      href="https://wa.me/94773043667" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-green-300 font-bold text-lg"
                    >
                      +94 77 304 3667
                    </a>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-blue-200">
                  <p>✅ 24/7 Support Available</p>
                  <p>✅ Quick Response Time</p>
                  <p>✅ Expert Assistance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12 py-6">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 SL Gaming Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
