import { PickupService } from "@/lib/services/pickup-service";
import { NextRequest, NextResponse } from "next/server";

// POST complete pickup
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const pickup = await PickupService.completePickup(id);

    if (!pickup) {
      return NextResponse.json(
        { success: false, error: "Pickup not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pickup completed successfully",
      pickup,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to complete pickup" },
      { status: 500 }
    );
  }
}
