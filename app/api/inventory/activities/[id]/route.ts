import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/lib/db";
import InventoryActivity, { IInventoryActivity } from "@/lib/models/inventoryActivities";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await connectDB();

    const activity = await InventoryActivity.findById<IInventoryActivity>(id).lean();

    if (!activity) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: String(activity._id),
      createdAt: activity.createdAt,
      details: activity.details,
    });
  } catch (error) {
    console.error(`/api/inventory/activities/[id] error:`, error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
