'use client'

import { useState, useEffect } from 'react'
import { ordersAPI } from '@/lib/api'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showSlipModal, setShowSlipModal] = useState(false)
  const [selectedOrderSlip, setSelectedOrderSlip] = useState(null)
  const [editingOrder, setEditingOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    orderNumber: '',
    customerName: '',
    customerEmail: '',
    game: '',
    package: '',
    amount: '',
    status: 'pending',
    gameId: '',
    playerNickname: '',
    paymentMethod: 'bank'
  })

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await ordersAPI.getAll()
      if (response.success) {
        setOrders(response.data || [])
      } else {
        console.error('Failed to load orders:', response.error)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingOrder(null)
    setFormData({
      orderNumber: `ORD${Date.now().toString().slice(-6)}`,
      customerName: '',
      customerEmail: '',
      game: '',
      package: '',
      amount: '',
      status: 'pending',
      gameId: '',
      playerNickname: '',
      paymentMethod: 'bank'
    })
    setShowModal(true)
  }

  const handleEdit = (order) => {
    setEditingOrder(order)
    setFormData(order)
    setShowModal(true)
  }

  const handleViewSlip = (order) => {
    setSelectedOrderSlip(order)
    setShowSlipModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        const result = await ordersAPI.delete(id)
        if (result.success) {
          setOrders(orders.filter(o => (o._id || o.id) !== id))
          alert('Order deleted successfully!')
        } else {
          alert('Failed to delete order')
        }
      } catch (error) {
        console.error('Error deleting order:', error)
        alert('Failed to delete order')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingOrder) {
        // Update existing order
        const result = await ordersAPI.update(editingOrder._id || editingOrder.id, formData)
        if (result.success) {
          setOrders(orders.map(o => 
            (o._id || o.id) === (editingOrder._id || editingOrder.id) ? result.data : o
          ))
          alert('Order updated successfully!')
        } else {
          alert('Failed to update order')
        }
      } else {
        // Add new order
        const result = await ordersAPI.create(formData)
        if (result.success) {
          setOrders([...orders, result.data])
          alert('Order added successfully!')
        } else {
          alert('Failed to add order')
        }
      }
      
      setShowModal(false)
    } catch (error) {
      console.error('Error saving order:', error)
      alert('Failed to save order')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="text-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Orders Management</h1>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Order #</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Game</th>
                <th className="px-4 py-3 text-left">Package</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                    No orders found. Click &quot;Add New Order&quot; to create one.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id || order.id} className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="px-4 py-3">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <div>{order.customerName}</div>
                      <div className="text-xs text-gray-400">{order.customerEmail || order.phone}</div>
                    </td>
                    <td className="px-4 py-3">{order.game}</td>
                    <td className="px-4 py-3">{order.package}</td>
                    <td className="px-4 py-3 font-semibold">LKR {order.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {order.paymentSlip && (
                          <button
                            onClick={() => handleViewSlip(order)}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition"
                          >
                            View Slip
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(order)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingOrder ? 'Edit Order' : 'Add New Order'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Order Number</label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Game ID</label>
                  <input
                    type="text"
                    value={formData.gameId}
                    onChange={(e) => setFormData({...formData, gameId: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Game</label>
                  <select
                    value={formData.game}
                    onChange={(e) => setFormData({...formData, game: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                  >
                    <option value="">Select Game</option>
                    <option value="Free Fire">Free Fire</option>
                    <option value="PUBG Mobile">PUBG Mobile</option>
                    <option value="Mobile Legends">Mobile Legends</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Package</label>
                  <input
                    type="text"
                    value={formData.package}
                    onChange={(e) => setFormData({...formData, package: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    placeholder="e.g., 310 Diamonds"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Amount</label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    placeholder="e.g., LKR 500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
                >
                  {editingOrder ? 'Update Order' : 'Add Order'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Slip Modal */}
      {showSlipModal && selectedOrderSlip && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-700 p-6 border-b border-gray-600 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Payment Slip Details</h2>
                <p className="text-gray-400">Order #{selectedOrderSlip.orderNumber}</p>
              </div>
              <button
                className="text-white bg-red-600 hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center text-xl transition"
                onClick={() => setShowSlipModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Order Information */}
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">Order Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Customer:</span>
                    <span className="text-white font-semibold ml-2">{selectedOrderSlip.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Game:</span>
                    <span className="text-white font-semibold ml-2">{selectedOrderSlip.game}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Package:</span>
                    <span className="text-white font-semibold ml-2">{selectedOrderSlip.package}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white font-semibold ml-2">{selectedOrderSlip.amount}</span>
                  </div>
                  {selectedOrderSlip.playerNickname && (
                    <>
                      <div>
                        <span className="text-gray-400">Player ID:</span>
                        <span className="text-white font-semibold ml-2">{selectedOrderSlip.gameId}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Player Name:</span>
                        <span className="text-white font-semibold ml-2">{selectedOrderSlip.playerNickname}</span>
                      </div>
                    </>
                  )}
                  {selectedOrderSlip.paymentMethod && (
                    <div>
                      <span className="text-gray-400">Payment Method:</span>
                      <span className="text-white font-semibold ml-2 capitalize">
                        {selectedOrderSlip.paymentMethod === 'bank' ? '🏦 Bank Transfer' : '💳 eZcash'}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(selectedOrderSlip.status)}`}>
                      {selectedOrderSlip.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Slip Image */}
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-bold text-yellow-400 mb-3">
                  Payment Slip {selectedOrderSlip.paymentMethod === 'bank' ? '(Bank Slip)' : '(eZcash Slip)'}
                </h3>
                {selectedOrderSlip.paymentSlip ? (
                  <div className="bg-gray-900 rounded-lg p-4">
                    <img 
                      src={selectedOrderSlip.paymentSlip} 
                      alt="Payment Slip" 
                      className="w-full max-h-[500px] object-contain rounded"
                    />
                    <div className="mt-4 flex gap-3">
                      <a
                        href={selectedOrderSlip.paymentSlip}
                        download={`payment-slip-${selectedOrderSlip.orderNumber}.png`}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
                      >
                        💾 Download Slip
                      </a>
                      <button
                        onClick={() => window.open(selectedOrderSlip.paymentSlip, '_blank')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
                      >
                        🔍 Open in New Tab
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-900 rounded-lg p-8 text-center text-gray-400">
                    <div className="text-5xl mb-3">📄</div>
                    <p>No payment slip uploaded for this order</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowSlipModal(false)}
                className="w-full mt-6 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
