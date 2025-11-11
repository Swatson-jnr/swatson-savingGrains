import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/user"

interface IUser {
  updatedAt?: Date;
  createdAt?: Date;
  first_name?: string;
}

/**
 * POST /api/auth/validate
 * Body: { phoneNumber: string, countryCode?: string }
 * Response: { frequency: "FIRST_TIMER" | "FREQUENT" | "STALE", firstName: string }
 */
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json().catch(() => ({}))
    const phoneNumber = body?.phoneNumber || body?.phone_number

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "phoneNumber is required" },
        { status: 400 },
      )
    }

    try {
      await connectDB()
    } catch (dbErr) {
      console.error("DB connect error in /auth/validate:", dbErr)
      // In development, return FIRST_TIMER so the app can continue testing without DB
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json(
          { frequency: "FIRST_TIMER", firstName: "" },
          { status: 200 },
        )
      }
      return NextResponse.json(
        { error: "Service unavailable" },
        { status: 503 },
      )
    }

    const user = await User.findOne({ phone_number: phoneNumber })

    if (!user) {
      return NextResponse.json(
        { frequency: "FIRST_TIMER", firstName: "" },
        { status: 200 },
      )
    }

    // Decide frequency based on last activity. Use updatedAt or createdAt if missing.
    const u: IUser = user as IUser
    const now = Date.now()
    const last = u?.updatedAt
      ? new Date(u.updatedAt).getTime()
      : u?.createdAt
      ? new Date(u.createdAt).getTime()
      : 0

    // threshold for stale users (ms)
    const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000

    let frequency: "FIRST_TIMER" | "FREQUENT" | "STALE" = "FREQUENT"
    const age = last ? now - last : Infinity
    if (!last || age === Infinity) frequency = "FIRST_TIMER"
    else if (age > NINETY_DAYS) frequency = "STALE"
    else frequency = "FREQUENT"

    return NextResponse.json(
      { frequency, firstName: u?.first_name || "" },
      { status: 200 },
    )
  } catch (error) {
    console.error("/auth/validate error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

export const GET = async () => {
  return NextResponse.json(
    { message: "Use POST /api/auth/validate" },
    { status: 200 },
  )
}

