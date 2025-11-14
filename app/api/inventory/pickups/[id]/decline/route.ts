import { NextResponse, type NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Pickup, { IPickup } from "@/lib/models/pickup";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // MUST await

    await connectDB();

    const updated = await Pickup.findByIdAndUpdate<IPickup>(
      id,
      { status: "declined" },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: String(updated._id),
      status: updated.status,
    });
  } catch (error) {
    const { id } = await context.params; // Safe to read again
    console.error(`/api/inventory/pickups/${id}/decline error:`, error);
    return NextResponse.json(
      { error: "Failed to decline pickup" },
      { status: 500 }
    );
  }
}
