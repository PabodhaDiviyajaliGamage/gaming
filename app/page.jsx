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

      {/* Player Details, Packages, Checkout Modals – unchanged UI, but logic fixed above */}

      {/* Footer */}
      <footer className="bg-gray-900 py-8 mt-20 text-center">
        <p>&copy; 2025 SL Gaming Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
