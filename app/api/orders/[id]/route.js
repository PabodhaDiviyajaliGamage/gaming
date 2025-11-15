import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Order from '@/models/Order'
import { sendEmail, getOrderCompletedEmail, getOrderCompletedAdminEmail } from '@/lib/email'

// GET single order
export async function GET(request, { params }) {
  try {
    await connectDB()
    const order = await Order.findById(params.id)
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data: order })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT update order
export async function PUT(request, { params }) {
  try {
    await connectDB()
    const body = await request.json()
    
    // Get the old order to check status change
    const oldOrder = await Order.findById(params.id)
    
    if (!oldOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    
    const order = await Order.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    })
    
    // Check if status changed to completed
    const statusChangedToCompleted = 
      oldOrder.status !== 'completed' && 
      order.status === 'completed'
    
    if (statusChangedToCompleted) {
      const adminEmail = process.env.ADMIN_EMAIL || 'slgaminghub09@gmail.com'
      
      // Send completion email to customer
      if (order.customerEmail) {
        sendEmail({
          to: order.customerEmail,
          ...getOrderCompletedEmail(order.toObject())
        }).catch(err => console.error('Failed to send customer completion email:', err))
      }
      
      // Send notification to admin
      sendEmail({
        to: adminEmail,
        ...getOrderCompletedAdminEmail(order.toObject())
      }).catch(err => console.error('Failed to send admin completion email:', err))
    }
    
    return NextResponse.json({ success: true, data: order })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}

// DELETE order
export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const order = await Order.findByIdAndDelete(params.id)
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
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
