import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Pickup from "@/lib/models/pickup"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"))
    const limit = Math.max(1, Number(url.searchParams.get("limit") || "10"))

    await connectDB()

    const query: any = { status: "pending" }

    const total = await Pickup.countDocuments(query)
    const items = await Pickup.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const mapped = items.map((it: any) => ({
      id: String(it._id),
      grain: it.grain,
      quantity: it.quantity,
      receivedQuantity: it.receivedQuantity,
      from: it.from,
      status: it.status,
    }))

    return NextResponse.json({ limit, page, total, items: mapped })
  } catch (error) {
    console.error("/api/inventory/pickups error:", error)
    return NextResponse.json(
      { error: "Failed to fetch pickups" },
      { status: 500 },
    )
  }
}

