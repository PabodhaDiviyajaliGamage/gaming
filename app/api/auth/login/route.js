import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'

// POST login
export async function POST(request) {
  try {
    await connectDB()
    const { email, password } = await request.json()
    
    // Find user by email
    const user = await User.findOne({ email })
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Check password (Note: In production, use bcrypt for password hashing)
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password
    
    return NextResponse.json({ success: true, data: userResponse })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
