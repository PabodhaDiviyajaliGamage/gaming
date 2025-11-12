'use client'

import { useState, useEffect } from 'react'

export default function AdminBannerPage() {
  const [bannerImage, setBannerImage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newBannerImage, setNewBannerImage] = useState('')

  useEffect(() => {
    loadBanner()
  }, [])

  const loadBanner = () => {
    const savedBanner = localStorage.getItem('headerBanner')
    if (savedBanner) {
      setBannerImage(savedBanner)
    }
  }

  const handleAdd = () => {
    setNewBannerImage('')
    setShowModal(true)
  }

  const handleUpdate = () => {
    setNewBannerImage(bannerImage)
    setShowModal(true)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete the header banner?')) {
      localStorage.removeItem('headerBanner')
      setBannerImage('')
      alert('Banner deleted successfully!')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!newBannerImage) {
      alert('Please upload a banner image')
      return
    }

    localStorage.setItem('headerBanner', newBannerImage)
    setBannerImage(newBannerImage)
    setShowModal(false)
    alert(bannerImage ? 'Banner updated successfully!' : 'Banner added successfully!')
  }

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Header Banner Management</h1>
          <p className="text-gray-400 mt-1">Manage the home page header banner image</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        {bannerImage ? (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-3">Current Banner</h2>
              <div className="bg-gray-900 rounded-lg p-4">
                <img 
                  src={bannerImage} 
                  alt="Header Banner" 
                  className="w-full max-h-96 object-contain rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
              >
                Update Banner
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
              >
                Delete Banner
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🖼️</div>
            <h3 className="text-xl font-bold mb-2">No Banner Set</h3>
            <p className="text-gray-400 mb-6">Upload a banner image to display on the home page header</p>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
            >
              + Add Banner
            </button>
          </div>
        )}
      </div>

      {/* Banner Preview Info */}
      <div className="mt-6 bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg p-4">
        <h3 className="font-bold text-blue-300 mb-2">📋 Banner Guidelines</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Recommended size: 1920x400 pixels (or similar wide aspect ratio)</li>
          <li>• Supported formats: PNG, JPG, WebP</li>
          <li>• Keep file size under 2MB for optimal performance</li>
          <li>• Use high-quality images that represent your gaming platform</li>
          <li>• Banner will be displayed at the top of the home page</li>
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {bannerImage ? 'Update Banner' : 'Add Banner'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Banner Image *
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          alert('File size should be less than 2MB')
                          return
                        }
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setNewBannerImage(reader.result)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Upload PNG, JPG, or WebP image (max 2MB, recommended: 1920x400px)
                  </p>
                  {newBannerImage && (
                    <div className="mt-3 p-3 bg-gray-700 rounded">
                      <p className="text-xs text-green-400 mb-2">Preview:</p>
                      <img 
                        src={newBannerImage} 
                        alt="Preview" 
                        className="w-full max-h-64 object-contain rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
                  >
                    {bannerImage ? 'Update' : 'Add'} Banner
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
