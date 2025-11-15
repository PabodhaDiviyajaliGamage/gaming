import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Order from '@/models/Order'
import { sendEmail, getNewOrderAdminEmail, getOrderConfirmationEmail } from '@/lib/email'

// GET all orders
export async function GET() {
  try {
    await connectDB()
    const orders = await Order.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST new order
export async function POST(request) {
  try {
    await connectDB()
    const body = await request.json()
    
    // Generate order number if not provided
    if (!body.orderNumber) {
      body.orderNumber = 'ORD' + Date.now().toString().slice(-6)
    }
    
    const order = await Order.create(body)

    // Send emails asynchronously (don't wait for completion)
    const adminEmail = process.env.ADMIN_EMAIL || 'slgaminghub09@gmail.com'
    
    // Send email to admin
    sendEmail({
      to: adminEmail,
      ...getNewOrderAdminEmail(order.toObject())
    }).catch(err => console.error('Failed to send admin email:', err))

    // Send confirmation email to customer if email is provided
    if (order.customerEmail) {
      sendEmail({
        to: order.customerEmail,
        ...getOrderConfirmationEmail(order.toObject())
      }).catch(err => console.error('Failed to send customer email:', err))
    }
    
    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
