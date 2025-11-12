'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and is admin
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const userRole = localStorage.getItem('userRole')
    
    if (!isLoggedIn || userRole !== 'admin') {
      alert('Access denied! Admin privileges required.')
      router.push('/')
    } else {
      setIsAuthorized(true)
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userName')
    localStorage.removeItem('userRole')
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 min-h-screen p-4">
          <div className="mb-6">
            <h2 className="text-white text-xl font-bold mb-2">Admin Panel</h2>
            <p className="text-gray-400 text-sm">
              {localStorage.getItem('userName')}
            </p>
          </div>
          
          <nav className="space-y-2">
            <Link href="/admin/orders" className="block text-white hover:bg-gray-700 p-3 rounded transition">
              📦 Orders
            </Link>
            <Link href="/admin/games" className="block text-white hover:bg-gray-700 p-3 rounded transition">
              🎮 Games
            </Link>
            <Link href="/admin/packages" className="block text-white hover:bg-gray-700 p-3 rounded transition">
              📦 Packages
            </Link>
            <Link href="/admin/users" className="block text-white hover:bg-gray-700 p-3 rounded transition">
              👥 Users
            </Link>
            <Link href="/admin/bank-details" className="block text-white hover:bg-gray-700 p-3 rounded transition">
              🏦 Bank Details
            </Link>
            <Link href="/admin/banner" className="block text-white hover:bg-gray-700 p-3 rounded transition">
              🖼️ Header Banner
            </Link>
            
            <hr className="border-gray-700 my-4" />
            
            <Link href="/" className="block text-blue-400 hover:bg-gray-700 p-3 rounded transition">
              🏠 Back to Home
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left text-red-400 hover:bg-gray-700 p-3 rounded transition"
            >
              🚪 Logout
            </button>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
