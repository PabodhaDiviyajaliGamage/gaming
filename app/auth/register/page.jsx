'use client'

import RegisterForm from '@/app/components/RegisterForm'
import Link from 'next/link'

export default function AuthRegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <RegisterForm 
          onShowLogin={() => window.location.href = '/auth/login'}
        />
        <div className="text-center mt-4">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
