'use client'

import { useState, useEffect } from 'react'

export default function AdminBankDetailsPage() {
  const [bankDetails, setBankDetails] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingBank, setEditingBank] = useState(null)
  const [formData, setFormData] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    branch: '',
    swiftCode: '',
    type: 'bank',
    status: 'active'
  })

  useEffect(() => {
    loadBankDetails()
  }, [])

  const loadBankDetails = () => {
    const savedBanks = localStorage.getItem('bankDetails')
    if (savedBanks) {
      setBankDetails(JSON.parse(savedBanks))
    } else {
      const sampleBanks = [
        { 
          id: 1, 
          bankName: 'eZcash', 
          accountName: 'SL Gaming Hub', 
          accountNumber: '0773043667', 
          branch: 'N/A', 
          swiftCode: 'N/A',
          type: 'mobile',
          status: 'active' 
        },
        { 
          id: 2, 
          bankName: 'eZcash', 
          accountName: 'SL Gaming Hub', 
          accountNumber: '0741880764', 
          branch: 'N/A', 
          swiftCode: 'N/A',
          type: 'mobile',
          status: 'active' 
        },
        { 
          id: 3, 
          bankName: 'Bank of Ceylon', 
          accountName: 'SL Gaming Hub (PVT) Ltd', 
          accountNumber: '0012345678901', 
          branch: 'Colombo Main', 
          swiftCode: 'BCEYLKLX',
          type: 'bank',
          status: 'active' 
        }
      ]
      localStorage.setItem('bankDetails', JSON.stringify(sampleBanks))
      setBankDetails(sampleBanks)
    }
  }

  const handleAdd = () => {
    setEditingBank(null)
    setFormData({ bankName: '', accountName: '', accountNumber: '', branch: '', swiftCode: '', type: 'bank', status: 'active' })
    setShowModal(true)
  }

  const handleEdit = (bank) => {
    setEditingBank(bank)
    setFormData(bank)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this bank detail?')) {
      const updatedBanks = bankDetails.filter(b => b.id !== id)
      setBankDetails(updatedBanks)
      localStorage.setItem('bankDetails', JSON.stringify(updatedBanks))
      alert('Bank detail deleted successfully!')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingBank) {
      const updatedBanks = bankDetails.map(b => 
        b.id === editingBank.id ? { ...formData, id: editingBank.id } : b
      )
      setBankDetails(updatedBanks)
      localStorage.setItem('bankDetails', JSON.stringify(updatedBanks))
      alert('Bank detail updated successfully!')
    } else {
      const newBank = { ...formData, id: Date.now() }
      const updatedBanks = [...bankDetails, newBank]
      setBankDetails(updatedBanks)
      localStorage.setItem('bankDetails', JSON.stringify(updatedBanks))
      alert('Bank detail added successfully!')
    }
    
    setShowModal(false)
  }

  const groupedBanks = bankDetails.reduce((acc, bank) => {
    if (!acc[bank.type]) acc[bank.type] = []
    acc[bank.type].push(bank)
    return acc
  }, {})

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bank Details Management</h1>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
        >
          + Add Bank Detail
        </button>
      </div>

      {Object.keys(groupedBanks).length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
          No bank details found. Click &quot;Add Bank Detail&quot; to create one.
        </div>
      ) : (
        <>
          {/* Mobile Payment Section */}
          {groupedBanks.mobile && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-green-400">📱 Mobile Payment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedBanks.mobile.map((bank) => (
                  <div key={bank.id} className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 border-2 border-green-600">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{bank.bankName}</h3>
                        <p className="text-sm text-green-300">{bank.accountName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        bank.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {bank.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="bg-black bg-opacity-30 rounded-lg p-4 mb-4">
                      <p className="text-xs text-gray-400 mb-1">Mobile Number</p>
                      <p className="text-2xl font-mono font-bold">{bank.accountNumber}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(bank)}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bank.id)}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bank Account Section */}
          {groupedBanks.bank && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">🏦 Bank Accounts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groupedBanks.bank.map((bank) => (
                  <div key={bank.id} className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 border-2 border-blue-600">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{bank.bankName}</h3>
                        <p className="text-sm text-blue-300">{bank.accountName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        bank.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {bank.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="bg-black bg-opacity-30 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Account Number</p>
                        <p className="text-xl font-mono font-bold">{bank.accountNumber}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black bg-opacity-30 rounded-lg p-3">
                          <p className="text-xs text-gray-400 mb-1">Branch</p>
                          <p className="text-sm font-semibold">{bank.branch}</p>
                        </div>
                        <div className="bg-black bg-opacity-30 rounded-lg p-3">
                          <p className="text-xs text-gray-400 mb-1">SWIFT Code</p>
                          <p className="text-sm font-semibold">{bank.swiftCode}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(bank)}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bank.id)}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingBank ? 'Edit Bank Detail' : 'Add Bank Detail'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                  >
                    <option value="bank">Bank Account</option>
                    <option value="mobile">Mobile Payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {formData.type === 'mobile' ? 'Service Name' : 'Bank Name'} *
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    placeholder={formData.type === 'mobile' ? 'e.g., eZcash' : 'e.g., Bank of Ceylon'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Account Name *</label>
                  <input
                    type="text"
                    value={formData.accountName}
                    onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {formData.type === 'mobile' ? 'Mobile Number' : 'Account Number'} *
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                  />
                </div>

                {formData.type === 'bank' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Branch</label>
                      <input
                        type="text"
                        value={formData.branch}
                        onChange={(e) => setFormData({...formData, branch: e.target.value})}
                        className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                        placeholder="e.g., Colombo Main"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">SWIFT Code</label>
                      <input
                        type="text"
                        value={formData.swiftCode}
                        onChange={(e) => setFormData({...formData, swiftCode: e.target.value})}
                        className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                        placeholder="e.g., BCEYLKLX"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
                >
                  {editingBank ? 'Update' : 'Add'}
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
    </div>
  )
}
