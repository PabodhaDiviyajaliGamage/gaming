import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'slgaminghub-secret-key-2025'

// POST login
export async function POST(request) {
  try {
    await connectDB()
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Find user by email (case insensitive)
    const user = await User.findOne({ email: email.toLowerCase() })
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    let isPasswordValid = false
    
    // Try bcrypt comparison first
    try {
      if (user.comparePassword) {
        isPasswordValid = await user.comparePassword(password)
      } else {
        // Fallback: manual bcrypt compare
        isPasswordValid = await bcrypt.compare(password, user.password)
      }
    } catch (bcryptError) {
      // If bcrypt fails, it might be a plain text password (legacy users)
      // Check if password matches directly (for migration period)
      if (user.password === password) {
        isPasswordValid = true
        
        // Auto-migrate: hash the password for next time
        try {
          const salt = await bcrypt.genSalt(10)
          const hashedPassword = await bcrypt.hash(password, salt)
          await User.updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword } }
          )
          console.log('Auto-migrated plain text password to bcrypt for user:', user.email)
        } catch (migrationError) {
          console.error('Failed to auto-migrate password:', migrationError)
        }
      }
    }
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || 'user'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // Remove password from response
    const userResponse = {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      phone: user.phone,
      createdAt: user.createdAt
    }
    
    // Create response with token
    const response = NextResponse.json({
      success: true,
      token,
      user: userResponse
    })
    
    // Set HTTP-only cookie for additional security
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })
    
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}
