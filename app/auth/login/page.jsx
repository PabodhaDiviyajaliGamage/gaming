'use client'

import LoginForm from '@/app/components/LoginForm'
import Link from 'next/link'

export default function AuthLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-blue-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm 
          onShowRegister={() => window.location.href = '/auth/register'}
        />
        <div className="text-center mt-4">
          <Link href="/" className="text-blue-400 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
