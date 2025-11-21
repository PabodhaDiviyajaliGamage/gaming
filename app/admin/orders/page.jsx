// app/admin/orders/page.jsx
"use client";
import { useState, useEffect } from "react";
import { ordersAPI } from "@/lib/api";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await ordersAPI.getAll();
      if (res.success) {
        setOrders(res.data || []);
      }
    } catch (err) {
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    if (!confirm(`Change status to ${newStatus.toUpperCase()}?`)) return;

    try {
      const res = await ordersAPI.update(id, { status: newStatus });
      if (res.success) {
        setOrders(orders.map((o) => (o._id === id ? res.data : o)));
        alert(`Order marked as ${newStatus}!`);
      }
    } catch (err) {
      alert("Update failed");
    }
  };

  const deleteOrder = async (id) => {
    if (!confirm("Delete this order permanently?")) return;
    try {
      await ordersAPI.delete(id);
      setOrders(orders.filter((o) => o._id !== id));
      alert("Order deleted!");
    } catch (err) {
      alert("Delete failed");
    }
  };

  const openSlipModal = (order) => {
    setSelectedOrder(order);
    setShowSlipModal(true);
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-500",
      processing: "bg-blue-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500",
    };
    return `px-3 py-1 rounded-full text-xs font-bold text-white ${
      colors[status] || "bg-gray-500"
    }`;
  };

  return (
    <div className="text-slate-800">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Orders Management</h1>
          <p className="text-slate-600 mt-2">Total Orders: {orders.length}</p>
        </div>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold text-white transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="bg-blue-100 rounded-xl overflow-hidden shadow-lg border border-blue-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                  Order #
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                  Game & Package
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-slate-600">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-4 text-xl">Loading orders...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-16 text-slate-600 text-xl"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-blue-100 transition">
                    <td className="px-6 py-4 font-mono font-bold text-blue-600">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{order.customerName}</div>
                      <div className="text-sm text-slate-600">
                        {order.customerEmail || order.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{order.game}</div>
                      <div className="text-sm text-slate-600">
                        {order.package}{" "}
                        {order.quantity > 1 && `×${order.quantity}`}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        ID: {order.gameId} | {order.playerNickname}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600">
                      LKR {order.amount?.toLocaleString() || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer outline-none ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-GB")}
                      <br />
                      {new Date(order.createdAt).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {order.paymentSlip && (
                          <button
                            onClick={() => openSlipModal(order)}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition"
                          >
                            View Slip
                          </button>
                        )}
                        <button
                          onClick={() => deleteOrder(order._id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Slip Modal */}
      {showSlipModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 p-6 flex justify-between items-center border-b border-gray-700">
              <div>
                <h2 className="text-3xl font-bold">Payment Slip</h2>
                <p className="text-yellow-400 font-mono text-xl mt-2">
                  Order #{selectedOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setShowSlipModal(false)}
                className="text-white bg-red-600 hover:bg-red-700 w-12 h-12 rounded-full text-2xl font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400">Customer:</span>{" "}
                    <strong>{selectedOrder.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400">Game:</span>{" "}
                    <strong>{selectedOrder.game}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400">Package:</span>{" "}
                    <strong>
                      {selectedOrder.package} ×{selectedOrder.quantity || 1}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-400">Amount:</span>{" "}
                    <strong className="text-green-400">
                      LKR {selectedOrder.amount}
                    </strong>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400">Player ID:</span>{" "}
                    <strong>{selectedOrder.gameId}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400">Nickname:</span>{" "}
                    <strong>{selectedOrder.playerNickname}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400">Method:</span>{" "}
                    <strong>
                      {selectedOrder.paymentMethod === "bank"
                        ? "Bank Transfer"
                        : "eZcash"}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>{" "}
                    <span className={getStatusBadge(selectedOrder.status)}>
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {selectedOrder.paymentSlip ? (
                <div className="bg-gray-900 rounded-xl p-6 border-2 border-gray-700">
                  <img
                    src={selectedOrder.paymentSlip}
                    alt="Payment Slip"
                    className="w-full rounded-lg shadow-2xl"
                  />
                  <div className="mt-6 flex gap-4 justify-center">
                    <a
                      href={selectedOrder.paymentSlip}
                      download={`slip-${selectedOrder.orderNumber}.jpg`}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold transition"
                    >
                      Download Slip
                    </a>
                    <button
                      onClick={() =>
                        window.open(selectedOrder.paymentSlip, "_blank")
                      }
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition"
                    >
                      Open Full Size
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <p className="text-2xl">No payment slip uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
