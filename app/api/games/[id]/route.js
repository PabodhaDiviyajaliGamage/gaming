import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Game from '@/models/Game'

// GET single game
export async function GET(request, { params }) {
  try {
    await connectDB()
    const game = await Game.findById(params.id)
    
    if (!game) {
      return NextResponse.json(
        { success: false, error: 'Game not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: game })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT update game
export async function PUT(request, { params }) {
  try {
    await connectDB()
    const body = await request.json()
    const game = await Game.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
    
    if (!game) {
      return NextResponse.json(
        { success: false, error: 'Game not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: game })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

// DELETE game
export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const game = await Game.findByIdAndDelete(params.id)
    
    if (!game) {
      return NextResponse.json(
        { success: false, error: 'Game not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: {} })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
