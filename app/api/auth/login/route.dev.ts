import { NextRequest, NextResponse } from "next/server"

// Development mock data for testing without MongoDB
const MOCK_USERS = [
  {
    _id: "dev_user_1",
    phone_number: "+233123456789",
    password: "$2a$10$rOvD4UAJUL9TaG1iGPW7qeVzfQQIGYqjFAuqE8Z3.WkdYrP1.cqJy", // "password123"
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
  },
  {
    _id: "dev_user_2",
    phone_number: "+233987654321",
    password: "$2a$10$rOvD4UAJUL9TaG1iGPW7qeVzfQQIGYqjFAuqE8Z3.WkdYrP1.cqJy", // "password123"
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
  },
]

/**
 * Development-only login endpoint for testing without MongoDB
 * Uses mock data and bypasses SMS sending
 */
export const POST = async (req: NextRequest) => {
  try {
    const { phone_number, password } = await req.json()

    if (!phone_number || !password) {
      return NextResponse.json(
        { error: "Phone number and password are required" },
        { status: 400 },
      )
    }

    // Find mock user
    const user = MOCK_USERS.find((u) => u.phone_number === phone_number)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // For development, accept the password "password123" for all users
    if (password !== "password123") {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      )
    }

    // Generate OTP (in real implementation, this would be stored in database)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    console.log(`[DEV] Generated OTP for ${phone_number}: ${otp}`)

    // Return success with development OTP (in production, only send via SMS)
    return NextResponse.json(
      {
        message: "OTP sent via SMS",
        // Include OTP in development for testing
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
        dev_note: "Use password 'password123' for any phone number",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
