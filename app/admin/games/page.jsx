'use client'

import { useState, useEffect } from 'react'
import { gamesAPI } from '@/lib/api'

export default function AdminGamesPage() {
  const [games, setGames] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingGame, setEditingGame] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    category: '',
    status: 'active'
  })

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    try {
      setLoading(true)
      const response = await gamesAPI.getAll()
      setGames(response.data || [])
    } catch (error) {
      console.error('Error loading games:', error)
      alert('Failed to load games: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingGame(null)
    setFormData({ name: '', image: '', description: '', category: '', status: 'active' })
    setShowModal(true)
  }

  const handleEdit = (game) => {
    setEditingGame(game)
    setFormData(game)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this game?')) {
      try {
        setLoading(true)
        await gamesAPI.delete(id)
        alert('Game deleted successfully!')
        loadGames()
      } catch (error) {
        console.error('Error deleting game:', error)
        alert('Failed to delete game: ' + error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      if (editingGame) {
        await gamesAPI.update(editingGame._id, formData)
        alert('Game updated successfully!')
      } else {
        await gamesAPI.create(formData)
        alert('Game added successfully!')
      }
      setShowModal(false)
      loadGames()
    } catch (error) {
      console.error('Error saving game:', error)
      alert('Failed to save game: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Games Management</h1>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
        >
          + Add New Game
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.length === 0 ? (
          <div className="col-span-3 bg-gray-800 rounded-lg p-8 text-center text-gray-400">
            No games found. Click "Add New Game" to create one.
          </div>
        ) : (
          games.map((game) => (
            <div key={game._id || game.id} className="bg-gray-800 rounded-lg p-6 hover:shadow-xl transition">
              <div className="text-center">
                {game.image ? (
                  <img 
                    src={game.image} 
                    alt={game.name}
                    className="w-24 h-24 mx-auto mb-3 object-contain rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextElementSibling.style.display = 'block'
                    }}
                  />
                ) : null}
                <div className="text-6xl mb-3" style={{display: game.image ? 'none' : 'block'}}>🎮</div>
                <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                <p className="text-gray-400 mb-2">{game.description}</p>
                <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-xs mb-3">
                  {game.category}
                </span>
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    game.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {game.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(game)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(game._id || game.id)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
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
              {editingGame ? 'Edit Game' : 'Add New Game'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Game Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Game Image (Optional)</label>
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

                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    placeholder="e.g., Top up diamonds"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Battle Royale">Battle Royale</option>
                    <option value="MOBA">MOBA</option>
                    <option value="RPG">RPG</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Action">Action</option>
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
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
                >
                  {editingGame ? 'Update' : 'Add'}
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
