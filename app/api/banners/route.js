import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Banner from '@/models/Banner'

// GET all banners or header banner
export async function GET(request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    let query = {}
    if (type) {
      query.type = type
    }
    
    const banners = await Banner.find(query).sort({ order: 1, createdAt: -1 })
    
    return NextResponse.json({ success: true, data: banners })
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST new banner
export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    
    // If adding header banner, deactivate existing header banners
    if (body.type === 'header' || !body.type) {
      await Banner.updateMany(
        { type: 'header' },
        { $set: { status: 'inactive' } }
      )
    }
    
    const banner = await Banner.create(body)
    
    return NextResponse.json({ success: true, data: banner }, { status: 201 })
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

// PUT update banner
export async function PUT(request) {
  try {
    await connectDB()
    const body = await request.json()
    const { _id, ...updateData } = body
    
    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Banner ID is required' },
        { status: 400 }
      )
    }
    
    const banner = await Banner.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
    
    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: banner })
  } catch (error) {
    console.error('Error updating banner:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

// DELETE banner
export async function DELETE(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Banner ID is required' },
        { status: 400 }
      )
    }
    
    const banner = await Banner.findByIdAndDelete(id)
    
    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: banner })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
