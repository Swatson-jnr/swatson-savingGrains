import { NextResponse } from "next/server"

// Debug endpoints removed: respond with 403 for safety.
export const GET = async () => {
  return NextResponse.json({ error: "Debug endpoint removed" }, { status: 403 })
}

export const POST = async () => {
  return NextResponse.json({ error: "Debug endpoint removed" }, { status: 403 })
}

export const PUT = POST

