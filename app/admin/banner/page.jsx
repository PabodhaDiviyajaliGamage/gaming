'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminBannerPage() {
  const [sliderImages, setSliderImages] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingImage, setEditingImage] = useState(null)
  const [newImage, setNewImage] = useState({
    image: '',
    order: 0
  })
  const [loading, setLoading] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)

  useEffect(() => {
    loadSliderImages()
  }, [])

  const loadSliderImages = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/banners?type=slider')
      
      if (res.data.success) {
        const sortedImages = res.data.data.sort((a, b) => a.order - b.order)
        setSliderImages(sortedImages)
      }
    } catch (error) {
      console.error('Error loading slider images:', error)
      alert('Error loading slider images: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingImage(null)
    setNewImage({
      image: '',
      order: sliderImages.length
    })
    setShowModal(true)
  }

  const handleEdit = (image) => {
    setEditingImage(image)
    setNewImage({
      image: image.image,
      order: image.order
    })
    setShowModal(true)
  }

  const handleDelete = async (imageId) => {
    if (!confirm('Are you sure you want to delete this slider image?')) {
      return
    }

    try {
      setLoading(true)
      await axios.delete(`/api/banners?id=${imageId}`)
      await loadSliderImages()
      alert('Slider image deleted successfully!')
    } catch (error) {
      console.error('Error deleting slider image:', error)
      alert('Error deleting slider image: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!newImage.image) {
      alert('Please upload an image')
      return
    }

    try {
      setLoading(true)

      const imageData = {
        image: newImage.image,
        title: `Slider Image ${newImage.order + 1}`,
        description: '',
        type: 'slider',
        status: 'active',
        order: newImage.order
      }

      if (editingImage) {
        // Update existing image
        await axios.put('/api/banners', {
          _id: editingImage._id,
          ...imageData
        })
        alert('Slider image updated successfully!')
      } else {
        // Create new image
        await axios.post('/api/banners', imageData)
        alert('Slider image added successfully!')
      }
      
      setShowModal(false)
      await loadSliderImages()
    } catch (error) {
      console.error('Error saving slider image:', error)
      alert('Error saving slider image: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === dropIndex) return

    try {
      setLoading(true)
      const newOrder = [...sliderImages]
      const draggedItem = newOrder[draggedIndex]
      
      // Remove dragged item and insert at new position
      newOrder.splice(draggedIndex, 1)
      newOrder.splice(dropIndex, 0, draggedItem)
      
      // Update order values
      const updatePromises = newOrder.map((item, index) => 
        axios.put('/api/banners', {
          _id: item._id,
          order: index
        })
      )
      
      await Promise.all(updatePromises)
      await loadSliderImages()
      
      alert('Slider order updated successfully!')
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error updating order: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
      setDraggedIndex(null)
    }
  }

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Hero Slider Management</h1>
          <p className="text-gray-400 mt-1">Manage images for the hero slider on the home page</p>
        </div>
        <button
          onClick={handleAdd}
          disabled={loading}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Slider Image
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : sliderImages.length > 0 ? (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Slider Images ({sliderImages.length})</h2>
              <p className="text-gray-400 text-sm">💡 Drag and drop to reorder</p>
            </div>
            
            <div className="grid gap-4">
              {sliderImages.map((image, index) => (
                <div
                  key={image._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`bg-gray-900 rounded-lg p-4 border-2 transition-all cursor-move hover:border-blue-500 ${
                    draggedIndex === index ? 'border-blue-400 opacity-50' : 'border-gray-700'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Drag Handle */}
                    <div className="flex flex-col items-center justify-center text-gray-400 px-2">
                      <svg className="w-4 h-4 mb-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM8 4h4v2H8V4zm0 4h4v2H8V8zm0 4h4v2H8v-2z"/>
                      </svg>
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    
                    {/* Image Preview */}
                    <div className="w-32 h-20 flex-shrink-0">
                      <img 
                        src={image.image} 
                        alt={image.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    
                    {/* Image Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">Slider Image {index + 1}</h3>
                      <p className="text-gray-400 text-sm mt-1">Order: {image.order} | Status: {image.status} | Type: {image.type}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {image._id}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(image)}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm font-semibold transition flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(image._id)}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-sm font-semibold transition flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🖼️</div>
            <h3 className="text-xl font-bold mb-2">No Slider Images</h3>
            <p className="text-gray-400 mb-6">Add images to create an engaging hero slider for your homepage</p>
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
            >
              + Add First Image
            </button>
          </div>
        )}
      </div>

      {/* Slider Guidelines */}
      <div className="mt-6 bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg p-4">
        <h3 className="font-bold text-blue-300 mb-2">📋 Slider Image Guidelines</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Recommended size: 1920x600 pixels (wide aspect ratio for hero display)</li>
          <li>• Supported formats: PNG, JPG, WebP</li>
          <li>• Keep file size under 2MB for optimal performance</li>
          <li>• Use high-quality images that represent your gaming platform</li>
          <li>• Add compelling titles and subtitles for better engagement</li>
          <li>• Drag and drop images to reorder slider sequence</li>
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingImage ? 'Edit Slider Image' : 'Add Slider Image'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Slider Image *
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
                          setNewImage(prev => ({ ...prev, image: reader.result }))
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Upload PNG, JPG, or WebP image (max 2MB, recommended: 1920x600px)
                  </p>
                  {newImage.image && (
                    <div className="mt-3 p-3 bg-gray-700 rounded">
                      <p className="text-xs text-green-400 mb-2">Preview:</p>
                      <img 
                        src={newImage.image} 
                        alt="Preview" 
                        className="w-full max-h-64 object-contain rounded"
                      />
                    </div>
                  )}
                </div>



                {/* Order */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={newImage.order}
                    onChange={(e) => setNewImage(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    min="0"
                    className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Lower numbers appear first in the slider
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition"
                  >
                    {loading ? 'Saving...' : (editingImage ? 'Update' : 'Add') + ' Image'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition"
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
