import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "slgaminghub-secret-key-2025";

// GET /api/users/profile - Get user profile with order history
export async function GET(request) {
  try {
    // Get token from Authorization header or cookies
    let token =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Connect to DB
    await connectDB();

    // Fetch user details
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Fetch user's orders (matching by email or name)
    const orders = await Order.find({
      $or: [
        { customerEmail: user.email },
        { customerName: user.name }
      ]
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      orders: orders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        gameName: order.gameName,
        packageName: order.packageName,
        packagePrice: order.packagePrice,
        status: order.status,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        playerId: order.playerId,
      })),
      stats: {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        completedOrders: orders.filter(o => o.status === 'completed').length,
        totalSpent: orders.filter(o => o.status === 'completed').reduce((sum, o) => {
          const price = parseFloat(o.packagePrice?.replace(/[^0-9.-]+/g, "") || 0);
          return sum + price;
        }, 0)
      }
    });
  } catch (error) {
    console.error("❌ Error in /api/users/profile:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
