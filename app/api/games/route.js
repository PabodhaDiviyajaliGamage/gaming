import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Game from '@/models/Game'

// GET all games
export async function GET() {
  try {
    await connectDB()
    const games = await Game.find({}).sort({ createdAt: 1 })
    return NextResponse.json({ success: true, data: games })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST new game
export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    const game = await Game.create(body)
    return NextResponse.json({ success: true, data: game }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
