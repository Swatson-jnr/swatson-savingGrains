import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import InventoryActivity, { IInventoryActivity } from "@/lib/models/inventoryActivities"

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    await connectDB()

    const activity = await InventoryActivity.findById<IInventoryActivity>(id).lean()

    if (!activity) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: String(activity._id),
      createdAt: activity.createdAt,
      details: activity.details,
    })
  } catch (error) {
    console.error(`/api/inventory/activities/${params.id} error:`, error)
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 },
    )
  }
}
