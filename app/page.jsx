// app/page.jsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { gamesAPI, packagesAPI, ordersAPI } from "@/lib/api";
import { defaultGames, defaultPackages } from "./data/defaultData";

export default function HomePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPlayerDetailsModal, setShowPlayerDetailsModal] = useState(false);
  const [showPackagesModal, setShowPackagesModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageQuantity, setPackageQuantity] = useState(1);
  const [playerDetails, setPlayerDetails] = useState({
    playerId: "",
    playerNickname: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentSlip, setPaymentSlip] = useState("");

  const [bannerImage, setBannerImage] = useState("");
  const [games, setGames] = useState([]);
  const [packages, setPackages] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);

    // Check login status
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    setUserName(localStorage.getItem("userName") || "");
    setUserRole(localStorage.getItem("userRole") || "");
    setUserEmail(localStorage.getItem("userEmail") || "");

    // Load banner
    try {
      const axios = (await import("axios")).default;
      const res = await axios.get("/api/banners?type=header");
      const active = res.data.data?.find((b) => b.status === "active");
      setBannerImage(active?.image || "");
    } catch (err) {
      setBannerImage("");
    }

    // Load games & packages
    try {
      const [gamesRes, packagesRes] = await Promise.all([
        gamesAPI.getAll(),
        packagesAPI.getAll(),
      ]);
      setGames(
        gamesRes.data?.filter((g) => g.status === "active") || defaultGames
      );
      setPackages(
        packagesRes.data?.filter((p) => p.status === "active") ||
          defaultPackages
      );
    } catch (err) {
      setGames(defaultGames);
      setPackages(defaultPackages);
    }

    setLoading(false);
  };

  const handleTopUpClick = (game) => {
    const gamePackages = packages
      .filter((pkg) => (pkg.gameName || pkg.game) === game.name)
      .map((pkg) => ({
        id: pkg._id || pkg.id,
        amount: pkg.amount,
        price: pkg.price,
        image: pkg.image,
        popular: pkg.popular || false,
      }));

    setSelectedGame({
      ...game,
      packages: gamePackages.length > 0 ? gamePackages : [],
    });
    setPackageQuantity(1);
    setShowPackagesModal(true);
  };

  const handlePackageSelect = (pkg) => {
    if (!isLoggedIn) {
      setShowPackagesModal(false);
      setShowLoginModal(true);
      alert("Please login to purchase");
      return;
    }
    setSelectedPackage({ ...pkg, quantity: packageQuantity });
    setShowPackagesModal(false);
    setShowPlayerDetailsModal(true);
  };

  const handlePlayerDetailsSubmit = (e) => {
    e.preventDefault();
    if (
      !playerDetails.playerId.trim() ||
      !playerDetails.playerNickname.trim()
    ) {
      alert("Please enter both Player ID and Nickname");
      return;
    }
    setShowPlayerDetailsModal(false);
    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!paymentMethod) return alert("Select payment method");
    if (!paymentSlip) return alert("Upload payment slip");

    const totalAmount =
      parseInt(selectedPackage.price.replace(/\D/g, "")) *
      selectedPackage.quantity;

    const order = {
      orderNumber: `ORD${Date.now().toString().slice(-6)}`,
      customerName: userName,
      customerEmail: userEmail,
      game: selectedGame.name,
      package: selectedPackage.amount,
      quantity: selectedPackage.quantity,
      amount: totalAmount,
      status: "pending",
      gameId: playerDetails.playerId,
      playerNickname: playerDetails.playerNickname,
      paymentMethod: paymentMethod,
      paymentSlip: paymentSlip,
    };

    try {
      const result = await ordersAPI.create(order);
      if (!result.success) throw new Error("Order failed");

      // Send emails via API
      await Promise.all([
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: "slgaminghub09@gmail.com",
            subject: `New Order #${
              result.data.orderNumber || order.orderNumber
            }`,
            html: `<h2>New Order!</h2><pre>${JSON.stringify(
              order,
              null,
              2
            )}</pre>`,
          }),
        }),
        userEmail &&
          fetch("/api/send-email", {
            method: "POST",
            body: JSON.stringify({
              to: userEmail,
              subject: `Order Confirmed #${
                result.data.orderNumber || order.orderNumber
              }`,
              html: `<h2>Thank you ${userName}!</h2><p>Your top-up is being processed.</p>`,
            }),
          }),
      ]).catch(() => console.log("Email failed but order saved"));

      alert(
        `Order placed successfully!\nOrder #: ${
          result.data.orderNumber || order.orderNumber
        }\nWe will deliver soon!`
      );
    } catch (err) {
      alert("Order failed. Please try again.");
      return;
    }

    // Reset
    setShowCheckoutModal(false);
    setPaymentMethod("");
    setPaymentSlip("");
    setSelectedPackage(null);
    setSelectedGame(null);
    setPlayerDetails({ playerId: "", playerNickname: "" });
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName("");
    setUserRole("");
    setUserEmail("");
    alert("Logged out!");
  };

  return (
    <div className="bg-blue-950 min-h-screen text-white">
      {/* Header */}
      <header className="bg-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-2xl font-bold">
              SL
            </div>
            <span className="text-2xl font-bold">SL Gaming Hub</span>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {userRole === "admin" && (
                  <Link
                    href="/admin/orders"
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold"
                  >
                    Admin Panel
                  </Link>
                )}
                <span className="text-orange-400 font-medium">
                  Hi, {userName}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-bold"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="w-full h-64 md:h-96 relative overflow-hidden">
        {bannerImage ? (
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-900 to-blue-900 flex items-center justify-center">
            <h1 className="text-5xl md:text-7xl font-bold text-center">
              SL Gaming Hub
            </h1>
          </div>
        )}
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Featured Games
        </h2>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => {
              const hasPackages = packages.some(
                (pkg) => (pkg.gameName || pkg.game) === game.name
              );
              return (
                <div
                  key={game._id || game.id}
                  className="bg-gray-800 rounded-2xl p-8 text-center hover:shadow-2xl hover:shadow-yellow-500/30 transition-all cursor-pointer border border-gray-700 hover:border-yellow-500"
                  onClick={() => hasPackages && handleTopUpClick(game)}
                >
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-48 h-48 mx-auto object-contain rounded-xl mb-6"
                  />
                  <h3 className="text-3xl font-bold mb-4 text-yellow-400">
                    {game.name}
                  </h3>
                  <p className="text-gray-400 mb-6">{game.description}</p>
                  <button
                    className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                      hasPackages
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!hasPackages}
                  >
                    {hasPackages ? "Top Up Now →" : "No Packages"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute -top-12 right-0 text-white text-3xl"
            >
              ✕
            </button>
            <LoginForm
              onClose={() => setShowLoginModal(false)}
              onShowRegister={() => {
                setShowLoginModal(false);
                setShowRegisterModal(true);
              }}
            />
          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <button
              onClick={() => setShowRegisterModal(false)}
              className="absolute -top-12 right-0 text-white text-3xl"
            >
              ✕
            </button>
            <RegisterForm
              onClose={() => setShowRegisterModal(false)}
              onShowLogin={() => {
                setShowRegisterModal(false);
                setShowLoginModal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Packages Modal */}
      {showPackagesModal && selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl max-w-4xl w-full p-8 my-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-yellow-400">{selectedGame.name}</h2>
                <p className="text-gray-400 mt-2">Select a package to top up</p>
              </div>
              <button
                onClick={() => setShowPackagesModal(false)}
                className="text-white bg-red-600 hover:bg-red-700 w-12 h-12 rounded-full text-2xl font-bold transition"
              >
                ✕
              </button>
            </div>

            {selectedGame.packages && selectedGame.packages.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {selectedGame.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => handlePackageSelect(pkg)}
                      className={`bg-gray-800 border-2 rounded-xl p-6 cursor-pointer hover:shadow-xl hover:shadow-yellow-500/30 transition ${
                        pkg.popular ? 'border-yellow-400' : 'border-gray-700 hover:border-yellow-400'
                      }`}
                    >
                      {pkg.popular && (
                        <div className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                          POPULAR
                        </div>
                      )}
                      {pkg.image && (
                        <img
                          src={pkg.image}
                          alt={pkg.amount}
                          className="w-20 h-20 mx-auto mb-4 object-contain"
                        />
                      )}
                      <h3 className="text-xl font-bold text-center mb-2">{pkg.amount}</h3>
                      <p className="text-2xl font-bold text-yellow-400 text-center">{pkg.price}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-6 p-4 bg-gray-800 rounded-lg">
                  <label className="text-lg font-medium">Quantity:</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPackageQuantity(Math.max(1, packageQuantity - 1))}
                      className="bg-red-600 hover:bg-red-700 w-10 h-10 rounded-lg font-bold text-xl transition"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold w-12 text-center">{packageQuantity}</span>
                    <button
                      onClick={() => setPackageQuantity(packageQuantity + 1)}
                      className="bg-green-600 hover:bg-green-700 w-10 h-10 rounded-lg font-bold text-xl transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">No packages available for this game</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Player Details Modal */}
      {showPlayerDetailsModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full p-8">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6">Player Details</h2>
            
            <form onSubmit={handlePlayerDetailsSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Player ID / Game ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your Player ID"
                  value={playerDetails.playerId}
                  onChange={(e) =>
                    setPlayerDetails({ ...playerDetails, playerId: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Player Nickname <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your Player Nickname"
                  value={playerDetails.playerNickname}
                  onChange={(e) =>
                    setPlayerDetails({ ...playerDetails, playerNickname: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none"
                  required
                />
              </div>

              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Selected Package:</p>
                <p className="text-xl font-bold text-yellow-400">{selectedPackage.amount}</p>
                <p className="text-lg font-bold">{selectedPackage.price} × {selectedPackage.quantity}</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPlayerDetailsModal(false);
                    setShowPackagesModal(true);
                  }}
                  className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black rounded-lg font-bold transition"
                >
                  Continue →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full p-8 my-8">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6">Checkout</h2>

            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-800 p-6 rounded-lg space-y-3">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                <div className="flex justify-between">
                  <span className="text-gray-400">Game:</span>
                  <span className="font-bold">{selectedGame.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Package:</span>
                  <span className="font-bold">{selectedPackage.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quantity:</span>
                  <span className="font-bold">{selectedPackage.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Player ID:</span>
                  <span className="font-bold">{playerDetails.playerId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Nickname:</span>
                  <span className="font-bold">{playerDetails.playerNickname}</span>
                </div>
                <hr className="border-gray-700 my-4" />
                <div className="flex justify-between text-xl">
                  <span className="text-yellow-400 font-bold">Total Amount:</span>
                  <span className="text-yellow-400 font-bold">
                    LKR {parseInt(selectedPackage.price.replace(/\D/g, "")) * selectedPackage.quantity}
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-lg font-medium mb-3">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank")}
                    className={`p-4 rounded-lg border-2 font-bold transition ${
                      paymentMethod === "bank"
                        ? "border-yellow-400 bg-yellow-400 bg-opacity-20"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    🏦 Bank Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-lg border-2 font-bold transition ${
                      paymentMethod === "card"
                        ? "border-yellow-400 bg-yellow-400 bg-opacity-20"
                        : "border-gray-700 bg-gray-800 hover:border-gray-600"
                    }`}
                  >
                    💳 Card Payment
                  </button>
                </div>
              </div>

              {/* Payment Slip Upload */}
              <div>
                <label className="block text-lg font-medium mb-3">
                  Upload Payment Slip <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setPaymentSlip(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-yellow-400 file:text-black file:font-bold hover:file:bg-yellow-500"
                  required
                />
                {paymentSlip && (
                  <div className="mt-4">
                    <img src={paymentSlip} alt="Payment slip preview" className="max-h-40 rounded-lg" />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCheckoutModal(false);
                    setShowPlayerDetailsModal(true);
                  }}
                  className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-bold transition"
                >
                  Place Order 🎮
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 py-8 mt-20 text-center">
        <p>&copy; 2025 SL Gaming Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
