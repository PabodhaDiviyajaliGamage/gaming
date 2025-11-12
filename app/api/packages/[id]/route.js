import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Package from '@/models/Package'

// GET single package
export async function GET(request, { params }) {
  try {
    await connectDB()
    const packageData = await Package.findById(params.id)
    
    if (!packageData) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: packageData })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT update package
export async function PUT(request, { params }) {
  try {
    await connectDB()
    const body = await request.json()
    const packageData = await Package.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
    
    if (!packageData) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: packageData })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

// DELETE package
export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const packageData = await Package.findByIdAndDelete(params.id)
    
    if (!packageData) {
      return NextResponse.json(
        { success: false, error: 'Package not found' },
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
