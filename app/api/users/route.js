import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'

// GET all users
export async function GET() {
  try {
    await connectDB()
    const users = await User.find({}).sort({ createdAt: -1 }).select('-password')
    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST new user (register)
export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      )
    }
    
    const user = await User.create(body)
    
    // Remove password from response
    const userResponse = user.toObject()
    delete userResponse.password
    
    return NextResponse.json({ success: true, data: userResponse }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
