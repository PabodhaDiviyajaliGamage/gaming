import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Order from '@/models/Order'

// Wrap email imports in a try-catch to prevent initialization errors
let emailFunctions = null;
try {
  const emailLib = require('@/lib/email');
  emailFunctions = {
    sendEmail: emailLib.sendEmail,
    getNewOrderAdminEmail: emailLib.getNewOrderAdminEmail,
    getOrderConfirmationEmail: emailLib.getOrderConfirmationEmail
  };
} catch (err) {
  console.warn('⚠️ Email library not available, emails will be skipped:', err.message);
}

// GET all orders
export async function GET() {
  try {
    console.log('📦 Fetching orders...');
    
    // Connect to database
    try {
      await connectDB();
      console.log('✅ Database connected for orders fetch');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database connection failed', details: dbError.message },
        { status: 500 }
      );
    }
    
    // Fetch orders
    const orders = await Order.find({}).sort({ createdAt: -1 });
    console.log(`✅ Found ${orders.length} orders`);
    
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST new order
export async function POST(request) {
  try {
    console.log('📝 Creating new order...');
    
    // Connect to database
    try {
      await connectDB();
      console.log('✅ Database connected for order creation');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database connection failed', details: dbError.message },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    console.log('📦 Order data:', body);
    
    // Generate order number if not provided
    if (!body.orderNumber) {
      body.orderNumber = 'ORD' + Date.now().toString().slice(-6);
    }
    
    const order = await Order.create(body);
    console.log('✅ Order created:', order.orderNumber);

    // Send emails asynchronously only if email functions are available
    if (emailFunctions) {
      const adminEmail = process.env.ADMIN_EMAIL || 'slgaminghub09@gmail.com';
      
      // Send email to admin
      emailFunctions.sendEmail({
        to: adminEmail,
        ...emailFunctions.getNewOrderAdminEmail(order.toObject())
      }).catch(err => console.error('⚠️ Failed to send admin email:', err));

      // Send confirmation email to customer if email is provided
      if (order.customerEmail) {
        emailFunctions.sendEmail({
          to: order.customerEmail,
          ...emailFunctions.getOrderConfirmationEmail(order.toObject())
        }).catch(err => console.error('⚠️ Failed to send customer email:', err));
      }
    } else {
      console.warn('⚠️ Email functions not available, skipping email notifications');
    }
    
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    return NextResponse.json(
      { success: false, error: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: 400 }
    );
  }
}
