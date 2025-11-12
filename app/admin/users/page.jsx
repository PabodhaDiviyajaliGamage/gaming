'use client'

import { useState, useEffect } from 'react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active'
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const savedUsers = localStorage.getItem('adminUsers')
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      const sampleUsers = [
        { id: 1, name: 'Admin User', email: 'admin@mail.com', phone: '0771234567', role: 'admin', status: 'active', createdAt: '2024-01-01' },
        { id: 2, name: 'Regular User', email: 'user@mail.com', phone: '0779876543', role: 'user', status: 'active', createdAt: '2024-01-02' }
      ]
      localStorage.setItem('adminUsers', JSON.stringify(sampleUsers))
      setUsers(sampleUsers)
    }
  }

  const handleAdd = () => {
    setEditingUser(null)
    setFormData({ name: '', email: '', phone: '', role: 'user', status: 'active' })
    setShowModal(true)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData(user)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== id)
      setUsers(updatedUsers)
      localStorage.setItem('adminUsers', JSON.stringify(updatedUsers))
      alert('User deleted successfully!')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingUser) {
      const updatedUsers = users.map(u => 
        u.id === editingUser.id ? { ...formData, id: editingUser.id, createdAt: editingUser.createdAt } : u
      )
      setUsers(updatedUsers)
      localStorage.setItem('adminUsers', JSON.stringify(updatedUsers))
      alert('User updated successfully!')
    } else {
      const newUser = { 
        ...formData, 
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0]
      }
      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)
      localStorage.setItem('adminUsers', JSON.stringify(updatedUsers))
      alert('User added successfully!')
    }
    
    setShowModal(false)
  }

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
        >
          + Add New User
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                    No users found. Click "Add New User" to create one.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-750">
                    <td className="px-4 py-3 font-semibold">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'
                      }`}>
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{user.createdAt}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(user)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded mr-2 text-sm transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition"
                      >
                        Delete
                      </button>
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
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

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
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
                >
                  {editingUser ? 'Update' : 'Add'}
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
