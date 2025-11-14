import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Pickup, { IPickup } from "@/lib/models/pickup";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();

    const updated = await Pickup.findByIdAndUpdate<IPickup>(
      id,
      { status: "declined" },
      { new: true }
    ).lean();

    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      id: String(updated._id),
      status: updated.status,
    });
  } catch (error) {
    console.error(`/api/inventory/pickups/${params.id}/decline error:`, error);
    return NextResponse.json(
      { error: "Failed to decline pickup" },
      { status: 500 }
    );
  }
}
