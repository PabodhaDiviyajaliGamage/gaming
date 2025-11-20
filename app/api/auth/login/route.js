import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "slgaminghub-secret-key-2025";

// POST login
export async function POST(request) {
  try {
    await connectDB();
    console.log("🔐 Login attempt received");

    const { email, password } = await request.json();
    console.log("📧 Email:", email);

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email (case insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("❌ User not found:", email);
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("👤 User found:", user.email);
    console.log(
      "🔍 Stored password format:",
      user.password ? user.password.substring(0, 15) + "..." : "empty"
    );
    console.log(
      "🔍 Provided password:",
      password ? password.substring(0, 3) + "***" : "empty"
    );

    let isPasswordValid = false;
    let needsMigration = false;

    // First, check if password looks like a bcrypt hash (starts with $2a$, $2b$, or $2y$)
    const isBcryptHash =
      user.password && /^\$2[ayb]\$.{56}$/.test(user.password);

    console.log("🔍 Is bcrypt hash?", isBcryptHash);

    if (isBcryptHash) {
      // Password is hashed - use bcrypt comparison
      console.log("🔐 Using bcrypt comparison...");
      try {
        if (user.comparePassword) {
          isPasswordValid = await user.comparePassword(password);
        } else {
          isPasswordValid = await bcrypt.compare(password, user.password);
        }
        console.log("✅ Bcrypt comparison result:", isPasswordValid);
      } catch (bcryptError) {
        console.error("❌ Bcrypt comparison error:", bcryptError.message);
        isPasswordValid = false;
      }
    } else {
      // Password is NOT hashed (plain text) - direct comparison
      console.log("📝 Detected plain-text password for user:", user.email);
      console.log("📝 Comparing:", password, "===", user.password);
      if (user.password === password) {
        isPasswordValid = true;
        needsMigration = true;
        console.log("✅ Plain-text password matched!");
      } else {
        console.log("❌ Plain-text password did NOT match");
      }
    }

    // If password is valid and needs migration, hash it now
    if (isPasswordValid && needsMigration) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.updateOne(
          { _id: user._id },
          { $set: { password: hashedPassword } }
        );
        console.log(
          "✅ Auto-migrated plain-text password to bcrypt for user:",
          user.email
        );
      } catch (migrationError) {
        console.error("❌ Failed to auto-migrate password:", migrationError);
      }
    }

    if (!isPasswordValid) {
      console.log("Login failed for user:", user.email, "- Invalid password");
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("✅ Login successful for user:", user.email);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || "user",
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Remove password from response
    const userResponse = {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || "user",
      phone: user.phone,
      createdAt: user.createdAt,
    };

    // Create response with token
    const response = NextResponse.json({
      success: true,
      token,
      user: userResponse,
    });

    // Set HTTP-only cookie for additional security
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Set userRole cookie for middleware
    response.cookies.set("userRole", user.role || "user", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
