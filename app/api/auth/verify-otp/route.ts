import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import connectDB from "@/lib/db"
import User from "@/lib/models/user"

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and complete login
 *     description: Verifies the OTP sent during login and returns a JWT token for authenticated requests
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - otp
 *             properties:
 *               phone_number:
 *                 type: string
 *                 description: User's registered phone number
 *                 example: "+233123456789"
 *               otp:
 *                 type: string
 *                 description: 6-digit OTP received via SMS
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated requests (expires in 7 days)
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad request - missing fields or invalid/expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   enum:
 *                     - "Phone number and OTP required"
 *                     - "Invalid OTP"
 *                     - "OTP expired"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Server error"
 */
export const POST = async (req: NextRequest) => {
  try {
    const { phone_number, otp } = await req.json()

    if (!phone_number || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP required" },
        { status: 400 },
      )
    }

    // Try to connect to MongoDB
    try {
      await connectDB()
    } catch (dbError) {
      console.error("Database connection failed:", dbError)

      // In production, return proper error
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 },
      )
    }

    const user = await User.findOne({ phone_number })

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 })

    // ✅ More robust comparison that handles both number and string types
    const storedOtp = user.otp?.toString().trim()
    const receivedOtp = otp?.toString().trim()

    if (!storedOtp || storedOtp !== receivedOtp) {
      return NextResponse.json(
        {
          error: "Invalid OTP",
        },
        { status: 400 },
      )
    }

    if (user.otp_expires_at && user.otp_expires_at < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 })
    }

    // ✅ Clear OTP and save
    await User.updateOne(
      { _id: user._id },
      { $set: { otp: null, otp_expires_at: null } },
    )

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user._id.toString(), phone_number: user.phone_number },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    )

    return NextResponse.json(
      { message: "Login successful", token },
      { status: 200 },
    )
  } catch (error) {
    console.error("OTP verification error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

