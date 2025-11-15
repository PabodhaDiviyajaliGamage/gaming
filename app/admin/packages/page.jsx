'use client'

import { useState, useEffect } from 'react'
import { packagesAPI, gamesAPI } from '@/lib/api'

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([])
  const [games, setGames] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  const [selectedGameFilter, setSelectedGameFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    gameId: '',
    gameName: '',
    amount: '',
    price: '',
    image: '',
    popular: false,
    status: 'active'
  })

  useEffect(() => {
    loadPackages()
    loadGames()
  }, [])

  const loadGames = async () => {
    try {
      const response = await gamesAPI.getAll()
      setGames(response.data || [])
    } catch (error) {
      console.error('Error loading games:', error)
    }
  }

  const loadPackages = async () => {
    try {
      setLoading(true)
      const response = await packagesAPI.getAll()
      setPackages(response.data || [])
    } catch (error) {
      console.error('Error loading packages:', error)
      alert('Failed to load packages: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingPackage(null)
    setFormData({ gameId: '', gameName: '', amount: '', price: '', image: '', popular: false, status: 'active' })
    setShowModal(true)
  }

  const handleEdit = (pkg) => {
    setEditingPackage(pkg)
    setFormData(pkg)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this package?')) {
      try {
        setLoading(true)
        await packagesAPI.delete(id)
        alert('Package deleted successfully!')
        loadPackages()
      } catch (error) {
        console.error('Error deleting package:', error)
        alert('Failed to delete package: ' + error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      if (editingPackage) {
        await packagesAPI.update(editingPackage._id, formData)
        alert('Package updated successfully!')
      } else {
        await packagesAPI.create(formData)
        alert('Package added successfully!')
      }
      setShowModal(false)
      loadPackages()
    } catch (error) {
      console.error('Error saving package:', error)
      alert('Failed to save package: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const groupedPackages = packages.reduce((acc, pkg) => {
    const gameName = pkg.gameName || pkg.game
    if (!acc[gameName]) acc[gameName] = []
    acc[gameName].push(pkg)
    return acc
  }, {})

  // Filter packages based on selected game
  const filteredPackages = selectedGameFilter === 'all' 
    ? packages 
    : packages.filter(pkg => (pkg.gameName || pkg.game) === selectedGameFilter)

  const filteredGroupedPackages = filteredPackages.reduce((acc, pkg) => {
    const gameName = pkg.gameName || pkg.game
    if (!acc[gameName]) acc[gameName] = []
    acc[gameName].push(pkg)
    return acc
  }, {})

  // Get unique games for filter
  const uniqueGames = [...new Set(packages.map(pkg => pkg.gameName || pkg.game))]

  return (
    <div className="text-white flex gap-6">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 rounded-lg p-6 h-fit sticky top-6">
        <button
          onClick={handleAdd}
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition mb-6"
        >
          + Add New Package
        </button>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">FILTER BY GAME</h3>
          <button
            onClick={() => setSelectedGameFilter('all')}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              selectedGameFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            All Games ({packages.length})
          </button>
          {uniqueGames.map(game => (
            <button
              key={game}
              onClick={() => setSelectedGameFilter(game)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                selectedGameFilter === game 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {game} ({packages.filter(p => (p.gameName || p.game) === game).length})
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6">Packages Management</h1>

        {Object.keys(filteredGroupedPackages).length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
            No packages found. Click "Add New Package" to create one.
          </div>
        ) : (
          Object.entries(filteredGroupedPackages).map(([game, pkgs]) => (
          <div key={game} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">{game}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pkgs.map((pkg) => (
                <div key={pkg._id || pkg.id} className={`bg-gray-800 border-2 ${pkg.popular ? 'border-yellow-500' : 'border-gray-700'} rounded-lg p-6 relative`}>
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    {pkg.image ? (
                      <img 
                        src={pkg.image} 
                        alt={pkg.amount || pkg.name}
                        className="w-24 h-24 mx-auto mb-3 object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 mx-auto mb-3 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-1">{pkg.amount || pkg.name}</h3>
                    <p className="text-2xl font-bold text-yellow-400 mt-2">{pkg.price}</p>
                  </div>

                  <div className="mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      pkg.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {pkg.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg._id || pkg.id)}
                      className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingPackage ? 'Edit Package' : 'Add New Package'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Game *</label>
                  <select
                    value={formData.gameId}
                    onChange={(e) => {
                      const selected = games.find(g => g._id === e.target.value)
                      setFormData({
                        ...formData, 
                        gameId: e.target.value,
                        gameName: selected ? selected.name : ''
                      })
                    }}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                  >
                    <option value="">Select Game</option>
                    {games.map(game => (
                      <option key={game._id} value={game._id}>{game.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Package Amount *</label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    placeholder="e.g., 310 Diamonds"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price *</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    placeholder="e.g., LKR 500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Package Image *</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setFormData({...formData, image: reader.result})
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    required={!formData.image}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Upload PNG, JPG, or WebP image (recommended: 256x256px)
                  </p>
                  {formData.image && (
                    <div className="mt-2 p-2 bg-gray-700 rounded">
                      <p className="text-xs text-gray-400 mb-1">Preview:</p>
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-16 h-16 object-contain rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, image: ''})}
                        className="text-xs text-red-400 mt-1 hover:text-red-300"
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="popular"
                    checked={formData.popular}
                    onChange={(e) => setFormData({...formData, popular: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <label htmlFor="popular" className="text-sm font-medium">Mark as Popular</label>
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
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
                >
                  {editingPackage ? 'Update' : 'Add'}
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
