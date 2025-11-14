import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import InventoryActivity from "@/lib/models/inventoryActivities"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"))
    const limit = Math.max(1, Number(url.searchParams.get("limit") || "10"))
    const filter = url.searchParams.get("filter") || "all"

    await connectDB()

    // Basic filter support: if filter === 'on_field' return activities related to inventory items currently on_field
    const query: Record<string, unknown> = {}
    if (filter !== "all") {
      // store the filter in details.action or details.fromWarehouse.name depending on upstream usage
      query["details.action"] = filter
    }

    const total = await InventoryActivity.countDocuments(query)
    const items = await InventoryActivity.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    // map to API shape expected by frontend (id, createdAt, details)
    const mapped = items.map((it: any) => ({
      id: String(it._id),
      createdAt: it.createdAt,
      details: it.details,
    }))

    return NextResponse.json({ limit, page, total, items: mapped })
  } catch (error) {
    console.error("/api/inventory/activities error:", error)
    return NextResponse.json(
      { error: "Failed to fetch inventory activities" },
      { status: 500 },
    )
  }
}

