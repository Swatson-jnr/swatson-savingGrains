import { NextResponse } from "next/server"

// Debug endpoint removed — respond 403 to avoid exposing credentials
export const POST = async () => {
  return NextResponse.json({ error: "Debug endpoint removed" }, { status: 403 })
}

