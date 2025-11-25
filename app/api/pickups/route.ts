import { PickupService } from "@/lib/services/pickup-service";
import { NextRequest, NextResponse } from "next/server";

// import { PickupService } from '@/services/pickupService';

// GET all pickups (with optional status filter)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let pickups;

    if (status) {
      pickups = await PickupService.getPickupsByStatus(status as any);
    } else {
      pickups = await PickupService.getAllPickups();
    }

    return NextResponse.json({
      success: true,
      pickups,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch pickups" },
      { status: 500 }
    );
  }
}

// POST create new pickup
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { purchaseId } = body;

    if (!purchaseId) {
      return NextResponse.json(
        { success: false, error: "Purchase ID is required" },
        { status: 400 }
      );
    }

    const pickup = await PickupService.createPickup(purchaseId);

    return NextResponse.json(
      {
        success: true,
        message: "Pickup created successfully",
        pickup,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create pickup" },
      { status: 500 }
    );
  }
}
