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
      console.log("❌ No token provided");
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log("✅ Token verified for user:", decoded.userId);
    } catch (err) {
      console.error("❌ Token verification failed:", err.message);
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Connect to DB
    try {
      await connectDB();
      console.log("✅ Database connected");
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError);
      return NextResponse.json(
        { success: false, message: "Database connection failed" },
        { status: 500 }
      );
    }

    // Fetch user details
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("❌ User not found:", decoded.userId);
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    console.log("✅ User found:", user.name, user.email);

    // Fetch user's orders (matching by email or name)
    let orders = [];
    try {
      orders = await Order.find({
        $or: [
          { customerEmail: user.email },
          { customerName: user.name }
        ]
      }).sort({ createdAt: -1 });
      console.log(`✅ Found ${orders.length} orders for user`);
    } catch (orderError) {
      console.error("❌ Error fetching orders:", orderError);
      // Continue without orders rather than failing
      orders = [];
    }

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
        gameName: order.game || order.gameName || "Unknown Game",
        packageName: order.package || order.packageName || "Unknown Package",
        packagePrice: order.amount || order.packagePrice || "N/A",
        status: order.status,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        playerId: order.gameId || order.playerId || "N/A",
        playerNickname: order.playerNickname || "N/A",
        quantity: order.quantity || 1,
      })),
      stats: {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        completedOrders: orders.filter(o => o.status === 'completed').length,
        totalSpent: orders.filter(o => o.status === 'completed').reduce((sum, o) => {
          const price = parseFloat((o.amount || o.packagePrice || "0").replace(/[^0-9.-]+/g, ""));
          return sum + (isNaN(price) ? 0 : price);
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
